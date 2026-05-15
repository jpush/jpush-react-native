#!/usr/bin/env python3
"""Fetch SDK changelog from JiGuang official docs for a specific version."""

import sys
import json
import re
import argparse

try:
    import requests
except ImportError:
    print("ERROR: Missing dependencies. Run: pip3 install requests")
    sys.exit(1)

CONFIG_PATH = ".claude/skills/update-sdk/scripts/config.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def fetch_changelog(url: str, target_version: str) -> str:
    """Fetch and extract changelog section for target_version from a Markdown URL."""
    md_url = url if url.endswith(".md") else url + ".md"

    try:
        resp = requests.get(md_url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        content = resp.text
    except requests.RequestException as e:
        return f"ERROR: Failed to fetch {md_url}: {e}"

    lines = content.split("\n")
    in_section = False
    section_lines = []

    for line in lines:
        # Match headings like: ## JPush Android SDK v6.1.0
        if re.match(r'^##\s+.*v?' + re.escape(target_version) + r'\b', line):
            in_section = True
            section_lines.append(line)
        elif in_section:
            if re.match(r'^##\s+', line):
                break  # next version section starts
            section_lines.append(line)

    if not section_lines:
        return f"VERSION_NOT_FOUND: Could not find changelog for version {target_version} at {md_url}"

    return "\n".join(section_lines).strip()


def main():
    parser = argparse.ArgumentParser(description="Fetch JiGuang SDK changelog")
    parser.add_argument("--android", help="Android SDK version")
    parser.add_argument("--ios", help="iOS SDK version")
    parser.add_argument("--harmony", help="HarmonyOS SDK version")
    args = parser.parse_args()

    config = load_config()
    urls = config.get("changelog_urls", {})
    result = {}

    platforms = [
        ("android", args.android),
        ("ios", args.ios),
        ("harmony", args.harmony),
    ]

    for platform, version in platforms:
        if version and platform in urls:
            print(f"\n=== Fetching {platform} changelog for v{version} ===")
            content = fetch_changelog(urls[platform], version)
            result[platform] = content
            print(content)

    cache_path = ".claude/skills/update-sdk/scripts/.changelog_cache.json"
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n=== Changelog saved to {cache_path} ===")


if __name__ == "__main__":
    main()
