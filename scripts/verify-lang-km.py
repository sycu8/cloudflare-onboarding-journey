#!/usr/bin/env python3
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent / "src"
span_re = re.compile(
    r'(<span (?:class|className)="[^"]*\blang-en\b[^"]*">)([\s\S]*?)(</span>)'
    r'(?!\s*\n?\s*<span (?:class|className)="[^"]*\blang-km\b)',
    re.MULTILINE,
)
bad = re.compile(r"\w+\.\w+Km\s*\?\?\s*\w+\.\w+Vi\s*\?\?\s*\w+\.\w+En")
dup = re.compile(
    r'(<span (?:class|className)="[^"]*\blang-km\b[^"]*">[\s\S]*?</span>\s*\n\s*)'
    r'(?=<span (?:class|className)="[^"]*\blang-km\b)',
)
missing = []
for p in sorted(root.rglob("*")):
    if p.suffix not in {".astro", ".tsx"}:
        continue
    src = p.read_text(encoding="utf-8")
    if span_re.search(src):
        missing.append(str(p.relative_to(root)))
print("missing:", len(missing))
print("bad chains:", sum(1 for p in root.rglob("*") if p.suffix in {".astro", ".tsx"} and bad.search(p.read_text(encoding="utf-8"))))
print("files with dup km:", sum(1 for p in root.rglob("*") if p.suffix in {".astro", ".tsx"} and dup.search(p.read_text(encoding="utf-8"))))
