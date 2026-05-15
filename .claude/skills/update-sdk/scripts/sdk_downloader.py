#!/usr/bin/env python3
"""Download and replace direct SDK files (for plugins that don't use maven/cocoapods)."""

import sys
import json
import re
import shutil
import fnmatch
import tempfile
import zipfile
import argparse
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: Missing dependencies. Run: pip3 install requests")
    sys.exit(1)

CONFIG_PATH = ".claude/skills/update-sdk/scripts/config.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

# Download URL keys per sdk_type and platform
# JCore has no standalone download — it's bundled inside JPush zip
DOWNLOAD_KEYS = {
    "jpush": {"android": "android", "ios": "ios", "harmony": "hmos"},
    "jcore": {"android": "android", "ios": "ios"},
}


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_zip_url(sdk_type: str, platform: str) -> tuple[str, str]:
    """Follow redirect chain to get the actual zip URL and available version."""
    key = DOWNLOAD_KEYS.get(sdk_type, {}).get(platform)
    if not key:
        return "", "unknown"

    base_url = f"https://www.jiguang.cn/downloads/sdk/{key}"
    try:
        resp = requests.get(base_url, allow_redirects=True, headers=HEADERS, timeout=30)
        final_url = resp.url
    except requests.RequestException as e:
        print(f"  ERROR: Failed to resolve download URL: {e}")
        return "", "unknown"

    filename = Path(final_url.split("?")[0]).name
    match = re.search(r"(\d+\.\d+\.\d+)", filename)
    version = match.group(1) if match else "unknown"
    return final_url, version


def extract_sdk_files(zip_url: str, dest_dir: Path, patterns: list) -> list[str]:
    """Download zip and extract files/dirs matching patterns into dest_dir."""
    dest_dir.mkdir(parents=True, exist_ok=True)

    print(f"  Downloading {zip_url.split('?')[0].split('/')[-1]} ...")
    try:
        resp = requests.get(zip_url, stream=True, headers=HEADERS, timeout=300)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR: Download failed: {e}")
        return []

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        zip_path = tmp_path / "sdk.zip"

        total = 0
        with open(zip_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=65536):
                f.write(chunk)
                total += len(chunk)
        print(f"  Downloaded {total // 1024} KB")

        with zipfile.ZipFile(zip_path) as zf:
            zf.extractall(tmp_path)

        copied = _copy_matching(tmp_path, dest_dir, patterns)

    return copied


SKIP_DIRS = {"example", "demo", "__MACOSX", ".git"}


def _copy_matching(src_root: Path, dest_dir: Path, patterns: list) -> list[str]:
    """Walk src_root and copy files/dirs whose name matches any pattern.

    Skips example/demo/__MACOSX directories and deduplicates by filename.
    """
    copied = []
    visited_dirs = set()
    copied_names = set()

    for item in sorted(src_root.rglob("*")):
        # Skip excluded directories and their contents
        if any(part in SKIP_DIRS for part in item.parts):
            continue
        # Skip if already copied as part of a parent directory
        if any(item.is_relative_to(d) for d in visited_dirs):
            continue

        name = item.name
        if not any(fnmatch.fnmatch(name, p) for p in patterns):
            continue
        # Deduplicate by filename
        if name in copied_names:
            continue

        dest = dest_dir / name

        if item.is_dir():
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(item, dest)
            visited_dirs.add(item)
            print(f"  Copied {name}/ → {dest_dir}")
        else:
            shutil.copy2(item, dest)
            print(f"  Copied {name} → {dest_dir}")

        copied.append(name)
        copied_names.add(name)

    return copied


def replace_from_local(user_path: str, dest_dir: Path, patterns: list) -> dict:
    """Copy SDK files from a user-provided local path."""
    src = Path(user_path)
    dest_dir.mkdir(parents=True, exist_ok=True)

    if src.is_file() and src.suffix == ".zip":
        print(f"  Extracting {src.name} ...")
        with tempfile.TemporaryDirectory() as tmp:
            with zipfile.ZipFile(src) as zf:
                zf.extractall(tmp)
            copied = _copy_matching(Path(tmp), dest_dir, patterns)
    else:
        copied = _copy_matching(src, dest_dir, patterns)

    return {"status": "updated", "source": "user_provided", "files": copied}


def handle_platform(platform: str, sdk_type: str, target_version: str,
                    direct_cfg: dict, user_sdk_path: str | None) -> dict:
    print(f"\n=== {platform.upper()} SDK (target: v{target_version}) ===")
    dest_dir = Path(direct_cfg["dest_dir"])
    patterns = direct_cfg.get("file_patterns", ["*.aar", "*.jar", "*.a", "*.framework", "*.xcframework"])

    if user_sdk_path:
        result = replace_from_local(user_sdk_path, dest_dir, patterns)
        return {"platform": platform, **result}

    zip_url, available_version = get_zip_url(sdk_type, platform)

    if not zip_url:
        return {"platform": platform, "status": "error", "reason": "Could not resolve download URL"}

    # For jcore, the SDK is bundled inside the JPush zip — skip zip-filename version check.
    # For jpush/harmony, zip filename carries the SDK version directly.
    if sdk_type != "jcore" and available_version != target_version.lstrip("v"):
        msg = (f"Latest available version is {available_version}, "
               f"target {target_version} not yet released. "
               f"Re-run with --{platform}-sdk-path /path/to/sdk when available.")
        print(f"  ⚠️  {msg}")
        return {"platform": platform, "status": "version_mismatch",
                "available": available_version, "target": target_version, "reason": msg}

    copied = extract_sdk_files(zip_url, dest_dir, patterns)
    if copied:
        return {"platform": platform, "status": "updated", "source": "auto", "files": copied}
    else:
        return {"platform": platform, "status": "error", "reason": "No matching files found in zip"}


def main():
    parser = argparse.ArgumentParser(description="Download and replace direct SDK files")
    parser.add_argument("--android", help="Android SDK target version")
    parser.add_argument("--ios", help="iOS SDK target version")
    parser.add_argument("--harmony", help="HarmonyOS SDK target version")
    parser.add_argument("--android-sdk-path", help="Local path to Android SDK (zip or dir)")
    parser.add_argument("--ios-sdk-path", help="Local path to iOS SDK (zip or dir)")
    parser.add_argument("--harmony-sdk-path", help="Local path to HarmonyOS SDK (zip or dir)")
    args = parser.parse_args()

    config = load_config()
    sdk_type = config.get("sdk_type", "jpush")
    direct_sdk = config.get("direct_sdk", {})

    if not direct_sdk:
        print("INFO: This plugin uses maven/cocoapods. No direct SDK files to manage.")
        return

    results = []
    platforms = [
        ("android", args.android, args.android_sdk_path),
        ("ios", args.ios, args.ios_sdk_path),
        ("harmony", args.harmony, args.harmony_sdk_path),
    ]

    for platform, version, user_path in platforms:
        if version and direct_sdk.get(platform):
            results.append(handle_platform(platform, sdk_type, version,
                                           direct_sdk[platform], user_path))

    with open(".claude/skills/update-sdk/scripts/.sdk_download_result.json", "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n=== SDK download summary ===")
    for r in results:
        icon = "✅" if r["status"] == "updated" else "⚠️ "
        detail = f" ({len(r.get('files', []))} files)" if r.get("files") else ""
        print(f"  {icon} {r['platform']}: {r['status']}{detail}")


if __name__ == "__main__":
    main()
