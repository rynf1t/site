#!/usr/bin/env python3
"""
Example Python tool.

Usage:
    uv run https://itsryan.me/tools/python/example.py "Hello, world!"
"""

import sys


def main():
    if len(sys.argv) < 2:
        print("Usage: uv run example.py <text>")
        print("Example: uv run example.py 'Hello, world!'")
        sys.exit(1)

    text = " ".join(sys.argv[1:])
    print(f"You said: {text}")
    print(f"In uppercase: {text.upper()}")
    print(f"Character count: {len(text)}")
    print(f"Word count: {len(text.split())}")


if __name__ == "__main__":
    main()
