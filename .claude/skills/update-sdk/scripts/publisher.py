#!/usr/bin/env python3
"""Publish plugin to package registry and create git tag."""

import sys
import json
import re
import subprocess
import argparse
from pathlib import Path

CONFIG_PATH = ".claude/skills/update-sdk/scripts/config.json"


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def run(cmd: list, cwd: str = ".") -> tuple:
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=300)
        return r.returncode == 0, (r.stdout + r.stderr).strip()
    except subprocess.TimeoutExpired:
        return False, "Command timed out after 300 seconds"
    except Exception as e:
        return False, str(e)


def get_plugin_version(config: dict) -> str:
    refs = config.get("version_refs", {})
    for ref in refs.get("plugin", {}).get("files", []):
        path = Path(ref["path"])
        if not path.exists():
            continue
        if path.suffix == ".json":
            data = json.loads(path.read_text(encoding="utf-8"))
            key = ref.get("key", "version")
            for k in key.split("."):
                data = data.get(k, {})
            if isinstance(data, str):
                return data
        elif path.suffix in (".yaml", ".yml"):
            m = re.search(r"^version:\s*(.+)$", path.read_text(encoding="utf-8"), re.MULTILINE)
            if m:
                return m.group(1).strip()
        elif path.suffix == ".xml":
            m = re.search(r'version="([^"]+)"', path.read_text(encoding="utf-8"))
            if m:
                return m.group(1)
    return "unknown"


def git_commit_and_tag(version: str, plugin_name: str) -> bool:
    print(f"\n[Git] Committing {plugin_name} v{version} ...")

    ok, out = run(["git", "add", "-A"])
    if not ok:
        print(f"  ERROR: git add failed:\n{out}")
        return False

    ok, out = run(["git", "commit", "-m", f"chore: release {plugin_name} v{version}"])
    if not ok:
        print(f"  ERROR: git commit failed:\n{out}")
        return False
    print(f"  ✅ Committed")

    ok, out = run(["git", "tag", f"v{version}"])
    if not ok:
        print(f"  ERROR: git tag failed:\n{out}")
        return False
    print(f"  ✅ Tagged v{version}")

    ok, out = run(["git", "push", "origin", "HEAD"])
    print(f"  {'✅' if ok else '⚠️ '} Push commits: {'OK' if ok else out}")

    ok, out = run(["git", "push", "origin", f"v{version}"])
    print(f"  {'✅' if ok else '⚠️ '} Push tag:     {'OK' if ok else out}")

    return True


def publish_npm() -> bool:
    print("\n[npm] Publishing ...")
    ok, out = run(["npm", "publish"])
    if ok:
        print("  ✅ Published to npm")
        return True
    print(f"  ERROR: npm publish failed:\n{out}")
    return False


def publish_dart() -> bool:
    print("\n[dart] Publishing to pub.dev ...")
    ok, out = run(["dart", "pub", "publish", "--force"])
    if ok:
        print("  ✅ Published to pub.dev")
        return True
    print(f"  ERROR: dart pub publish failed:\n{out}")
    return False


def prompt_dcloud(config: dict, plugin_name: str, version: str):
    pub = config.get("publish", {})
    paths = pub.get("dcloud_upload_paths", ["."])
    print(f"\n⚠️  [{plugin_name} v{version}] 需手动上传至 DCloud 插件市场")
    print(f"   上传地址: https://ext.dcloud.net.cn/")
    print(f"   请上传以下目录：")
    for p in paths:
        print(f"     - {Path(p).resolve()}")


def main():
    parser = argparse.ArgumentParser(description="Publish plugin")
    parser.add_argument("--skip-git", action="store_true", help="Skip git commit/tag/push")
    parser.add_argument("--skip-publish", action="store_true", help="Skip package registry publish")
    args = parser.parse_args()

    config = load_config()
    plugin_name = config.get("plugin_name", "unknown")
    pub_type = config.get("publish", {}).get("type", "npm")
    version = get_plugin_version(config)

    print(f"\n=== Publishing {plugin_name} v{version} ===")

    if not args.skip_git:
        git_commit_and_tag(version, plugin_name)

    if args.skip_publish:
        print("Skipping publish (--skip-publish)")
        return

    if pub_type == "npm":
        publish_npm()
    elif pub_type == "dart":
        publish_dart()
    elif pub_type == "dcloud":
        prompt_dcloud(config, plugin_name, version)
    elif pub_type == "npm_and_dcloud":
        publish_npm()
        prompt_dcloud(config, plugin_name, version)

    print(f"\n=== Done: {plugin_name} ===")


if __name__ == "__main__":
    main()
