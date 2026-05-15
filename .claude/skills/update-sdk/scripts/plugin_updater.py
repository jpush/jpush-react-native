#!/usr/bin/env python3
"""Update SDK version references in plugin files based on config.json."""

import sys
import json
import re
import argparse
from pathlib import Path
from datetime import datetime

CONFIG_PATH = ".claude/skills/update-sdk/scripts/config.json"


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def bump_patch(version: str) -> str:
    """Bump patch version. patch and minor cap at 9; carry over to next component at 10."""
    parts = version.split(".")
    major, minor, patch = int(parts[0]), int(parts[1]), int(parts[2])
    patch += 1
    if patch >= 10:
        patch = 0
        minor += 1
    if minor >= 10:
        minor = 0
        major += 1
    return f"{major}.{minor}.{patch}"


def get_current_version_from_ref(ref: dict) -> str | None:
    """Read the current version string from a file ref."""
    path = Path(ref["path"])
    if not path.exists():
        return None
    content = path.read_text(encoding="utf-8")

    if "pattern" in ref:
        regex = re.escape(ref["pattern"]).replace(r"\{VERSION\}", r"([\d.]+(?:-\w+)?)")
        match = re.search(regex, content)
        return match.group(1) if match else None
    elif "key" in ref:
        if path.suffix in (".yaml", ".yml"):
            match = re.search(r"^version:\s*(.+)$", content, re.MULTILINE)
            return match.group(1).strip() if match else None
        elif path.suffix == ".xml":
            key = ref["key"]
            match = re.search(rf'{re.escape(key)}="([^"]+)"', content)
            return match.group(1) if match else None
        else:  # JSON
            try:
                data = json.loads(content)
                keys = ref["key"].split(".")
                obj = data
                for k in keys:
                    obj = obj[k]
                return str(obj)
            except (KeyError, json.JSONDecodeError):
                return None
    return None


def update_by_pattern(file_path: str, pattern: str, new_version: str) -> bool:
    """Replace version in file using a pattern with {VERSION} placeholder."""
    path = Path(file_path)
    if not path.exists():
        print(f"  WARNING: File not found: {file_path}")
        return False

    content = path.read_text(encoding="utf-8")
    regex = re.escape(pattern).replace(r"\{VERSION\}", r"([\d.]+(?:-\w+)?)")
    replacement = pattern.replace("{VERSION}", new_version)

    match = re.search(regex, content)
    if not match:
        print(f"  WARNING: Pattern not found in {file_path}")
        print(f"           Pattern: {pattern}")
        return False

    old_version = match.group(1)
    if old_version == new_version:
        print(f"  SKIP: {file_path} already at {new_version}")
        return True

    new_content = content.replace(match.group(0), replacement, 1)
    path.write_text(new_content, encoding="utf-8")
    print(f"  UPDATED: {file_path}  {old_version} → {new_version}")
    return True


def update_json_field(file_path: str, key: str, new_version: str) -> bool:
    """Update a field in a JSON file (supports dot-notation keys)."""
    path = Path(file_path)
    if not path.exists():
        print(f"  WARNING: File not found: {file_path}")
        return False

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    keys = key.split(".")
    obj = data
    for k in keys[:-1]:
        obj = obj.setdefault(k, {})

    old = obj.get(keys[-1], "unknown")
    if old == new_version:
        print(f"  SKIP: {file_path} [{key}] already at {new_version}")
        return True

    obj[keys[-1]] = new_version
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"  UPDATED: {file_path} [{key}]  {old} → {new_version}")
    return True


def update_yaml_version(file_path: str, new_version: str) -> bool:
    """Update 'version:' line in a YAML file."""
    path = Path(file_path)
    if not path.exists():
        print(f"  WARNING: File not found: {file_path}")
        return False

    content = path.read_text(encoding="utf-8")
    match = re.search(r"^(version:\s*)(.+)$", content, re.MULTILINE)
    if not match:
        print(f"  WARNING: No 'version:' field found in {file_path}")
        return False

    old_version = match.group(2).strip()
    if old_version == new_version:
        print(f"  SKIP: {file_path} already at {new_version}")
        return True

    new_content = content.replace(match.group(0), f"{match.group(1)}{new_version}", 1)
    path.write_text(new_content, encoding="utf-8")
    print(f"  UPDATED: {file_path}  {old_version} → {new_version}")
    return True


def update_xml_attribute(file_path: str, attribute: str, new_version: str) -> bool:
    """Update a version attribute in an XML file (e.g., plugin.xml version="X.X.X")."""
    path = Path(file_path)
    if not path.exists():
        print(f"  WARNING: File not found: {file_path}")
        return False

    content = path.read_text(encoding="utf-8")
    pattern = rf'({re.escape(attribute)}=")([^"]+)(")'
    match = re.search(pattern, content)
    if not match:
        print(f"  WARNING: Attribute '{attribute}' not found in {file_path}")
        return False

    old_version = match.group(2)
    if old_version == new_version:
        print(f"  SKIP: {file_path} [{attribute}] already at {new_version}")
        return True

    new_content = content.replace(match.group(0), f'{match.group(1)}{new_version}{match.group(3)}', 1)
    path.write_text(new_content, encoding="utf-8")
    print(f"  UPDATED: {file_path} [{attribute}]  {old_version} → {new_version}")
    return True


def update_config_json_dep(file_path: str, dep_prefix: str, new_version: str) -> bool:
    """Update a maven dependency version in a UTS config.json dependencies array."""
    path = Path(file_path)
    if not path.exists():
        print(f"  WARNING: File not found: {file_path}")
        return False

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    deps = data.get("dependencies", [])
    updated = False
    for i, dep in enumerate(deps):
        if isinstance(dep, str) and dep.startswith(dep_prefix):
            old = dep
            parts = dep.rsplit(":", 1)
            deps[i] = f"{parts[0]}:{new_version}"
            print(f"  UPDATED: {file_path} dep  {old} → {deps[i]}")
            updated = True

    if not updated:
        print(f"  WARNING: Dependency prefix '{dep_prefix}' not found in {file_path}")
        return False

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent="\t", ensure_ascii=False)
        f.write("\n")
    return True


def update_changelog(changelog_file: str, plugin_version: str, summary: str):
    path = Path(changelog_file)
    date_str = datetime.now().strftime("%Y-%m-%d")
    entry = f"## {plugin_version} ({date_str})\n\n{summary}\n\n"
    existing = path.read_text(encoding="utf-8") if path.exists() else "# Changelog\n\n"
    path.write_text(entry + existing, encoding="utf-8")
    print(f"  UPDATED: {changelog_file} → added v{plugin_version} entry")


def process_file_ref(ref: dict, version: str) -> bool:
    path = ref["path"]
    if "pattern" in ref:
        return update_by_pattern(path, ref["pattern"], version)
    elif "key" in ref:
        if path.endswith(".yaml") or path.endswith(".yml"):
            return update_yaml_version(path, version)
        elif path.endswith(".xml"):
            return update_xml_attribute(path, ref["key"], version)
        else:
            return update_json_field(path, ref["key"], version)
    elif "dep_prefix" in ref:
        return update_config_json_dep(path, ref["dep_prefix"], version)
    return False


def main():
    parser = argparse.ArgumentParser(description="Update SDK version references")
    parser.add_argument("--android", help="Android SDK version")
    parser.add_argument("--ios", help="iOS SDK version")
    parser.add_argument("--plugin-version", help="Explicit new plugin version")
    parser.add_argument("--bump-patch", action="store_true",
                        help="Auto-bump patch (carry at 10: x.y.9→x.(y+1).0, x.9.9→(x+1).0.0)")
    parser.add_argument("--changelog-summary", default="", help="Summary for CHANGELOG.md")
    args = parser.parse_args()

    config = load_config()
    refs = config.get("version_refs", {})

    print("\n=== Updating version references ===")

    if args.android and "android_sdk" in refs:
        print(f"\n[Android SDK → {args.android}]")
        for ref in refs["android_sdk"].get("files", []):
            process_file_ref(ref, args.android)

    if args.ios and "ios_sdk" in refs:
        print(f"\n[iOS SDK → {args.ios}]")
        for ref in refs["ios_sdk"].get("files", []):
            process_file_ref(ref, args.ios)

    # Resolve plugin version
    plugin_version = args.plugin_version
    if args.bump_patch and not plugin_version and "plugin" in refs:
        for ref in refs["plugin"].get("files", []):
            current = get_current_version_from_ref(ref)
            if current:
                plugin_version = bump_patch(current)
                print(f"\n[Auto bump-patch: {current} → {plugin_version}]")
                break
        if not plugin_version:
            print("  ERROR: Could not read current plugin version for bump-patch")
            sys.exit(1)

    if plugin_version and "plugin" in refs:
        print(f"\n[Plugin version → {plugin_version}]")
        for ref in refs["plugin"].get("files", []):
            process_file_ref(ref, plugin_version)

    if plugin_version and args.changelog_summary:
        changelog_file = config.get("changelog_file", "CHANGELOG.md")
        update_changelog(changelog_file, plugin_version, args.changelog_summary)

    print("\n=== Version update complete ===")


if __name__ == "__main__":
    main()
