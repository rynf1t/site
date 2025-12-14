#!/usr/bin/env python3
"""
Generate documentation for HTML tools using LLM.

This script automatically generates or updates descriptions for HTML tools.
It will regenerate descriptions if the HTML file is newer than the .md file.

This script is OPTIONAL. You can also just write .md files manually.

Usage:
    python scripts/generate-docs.py
    python scripts/generate-docs.py --dry-run  # See what would be done
    python scripts/generate-docs.py --verbose  # See detailed output
    python scripts/generate-docs.py --force  # Force regenerate all descriptions

Requirements:
    pip install llm llm-anthropic
    llm keys set anthropic  # Set your API key
"""

import subprocess
import glob
from pathlib import Path
import argparse
import os

PROMPT = """
Write a one-sentence description for this tool.
Do not use words like "just" or "simply".
Do not start with "This tool" or "This is".
Start directly with what the tool does.
Be concise and clear.
""".strip()


def generate_description(html_file):
    """Generate a description for an HTML tool using LLM."""
    try:
        result = subprocess.run(
            [
                'llm',
                '-m', 'claude-haiku-4.5',
                '--system', PROMPT,
                '-'
            ],
            input=open(html_file).read(),
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error generating description for {html_file}: {e}")
        return None
    except FileNotFoundError:
        print("Error: 'llm' command not found. Install with: pip install llm llm-anthropic")
        print("Then set your API key with: llm keys set anthropic")
        return None


def should_regenerate(html_file, md_file, force=False):
    """Determine if description should be regenerated."""
    if force:
        return True
    
    # Generate if .md file doesn't exist
    if not md_file.exists():
        return True
    
    # Regenerate if HTML file is newer than .md file
    html_mtime = os.path.getmtime(html_file)
    md_mtime = os.path.getmtime(md_file)
    
    return html_mtime > md_mtime


def main():
    parser = argparse.ArgumentParser(description="Generate documentation for HTML tools")
    parser.add_argument('--verbose', '-v', action='store_true', help="Verbose output")
    parser.add_argument('--dry-run', action='store_true', help="Show what would be done")
    parser.add_argument('--force', action='store_true', help="Force regenerate all descriptions")
    args = parser.parse_args()

    # Find all HTML files in public/tools
    tools_dir = Path('public/tools')
    if not tools_dir.exists():
        print(f"Error: {tools_dir} not found")
        return

    html_files = list(tools_dir.glob('*.html'))
    # Skip template files
    html_files = [f for f in html_files if not f.name.startswith('_')]

    if not html_files:
        print("No HTML tools found in public/tools/")
        return

    print(f"Found {len(html_files)} HTML tool(s)")

    generated = 0
    updated = 0
    skipped = 0

    for html_file in html_files:
        md_file = html_file.with_suffix('.md')

        if args.verbose:
            print(f"\nProcessing {html_file.name}...")

        # Check if we should regenerate
        if not should_regenerate(html_file, md_file, args.force):
            if args.verbose:
                print(f"  Skipping - {md_file.name} is up to date")
            skipped += 1
            continue

        if args.dry_run:
            action = "update" if md_file.exists() else "generate"
            print(f"Would {action} description for {html_file.name}")
            if md_file.exists():
                updated += 1
            else:
                generated += 1
            continue

        # Generate/update description
        if args.verbose:
            action = "Updating" if md_file.exists() else "Generating"
            print(f"  {action} description...")

        description = generate_description(html_file)

        if description:
            was_existing = md_file.exists()
            md_file.write_text(description + '\n')
            action_text = "Updated" if was_existing else "Generated"
            print(f"✓ {action_text} {md_file.name}")
            if was_existing:
                updated += 1
            else:
                generated += 1
        else:
            print(f"✗ Failed to generate description for {html_file.name}")
            skipped += 1

    print(f"\nSummary: {generated} generated, {updated} updated, {skipped} skipped")


if __name__ == '__main__':
    main()
