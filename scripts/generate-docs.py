#!/usr/bin/env python3
"""
Generate documentation for HTML tools using LLM.

This script is OPTIONAL. You can also just write .md files manually.

Usage:
    python scripts/generate-docs.py
    python scripts/generate-docs.py --dry-run  # See what would be done
    python scripts/generate-docs.py --verbose  # See detailed output

Requirements:
    pip install llm llm-anthropic
    llm keys set anthropic  # Set your API key
"""

import subprocess
import glob
from pathlib import Path
import argparse

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


def main():
    parser = argparse.ArgumentParser(description="Generate documentation for HTML tools")
    parser.add_argument('--verbose', '-v', action='store_true', help="Verbose output")
    parser.add_argument('--dry-run', action='store_true', help="Show what would be done")
    args = parser.parse_args()

    # Find all HTML files in public/tools
    tools_dir = Path('public/tools')
    if not tools_dir.exists():
        print(f"Error: {tools_dir} not found")
        return

    html_files = list(tools_dir.glob('*.html'))

    if not html_files:
        print("No HTML tools found in public/tools/")
        return

    print(f"Found {len(html_files)} HTML tool(s)")

    generated = 0
    skipped = 0

    for html_file in html_files:
        md_file = html_file.with_suffix('.md')

        if args.verbose:
            print(f"\nProcessing {html_file.name}...")

        # Skip if description already exists
        if md_file.exists():
            if args.verbose:
                print(f"  Skipping - {md_file.name} already exists")
            skipped += 1
            continue

        if args.dry_run:
            print(f"Would generate description for {html_file.name}")
            generated += 1
            continue

        # Generate description
        if args.verbose:
            print(f"  Generating description...")

        description = generate_description(html_file)

        if description:
            md_file.write_text(description + '\n')
            print(f"✓ Generated {md_file.name}")
            generated += 1
        else:
            print(f"✗ Failed to generate description for {html_file.name}")
            skipped += 1

    print(f"\nSummary: {generated} generated, {skipped} skipped")


if __name__ == '__main__':
    main()
