#!/usr/bin/env python3
"""Remove duplicate consecutive lang-km spans and fix label .en -> .km ?? .en."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"

DUP_KM = re.compile(
    r'(<span (?:class|className)="[^"]*\blang-km\b[^"]*">[\s\S]*?</span>\s*\n\s*)'
    r'(<span (?:class|className)="[^"]*\blang-km\b[^"]*">[\s\S]*?</span>)',
)


def dedupe_lang_km(src: str) -> str:
    prev = None
    while prev != src:
        prev = src
        src = DUP_KM.sub(r"\1", src)
    return src


def fix_label_refs(src: str) -> str:
    src = re.sub(
        r"\{(levelLabels|trackLabels)\[([^\]]+)\]\.en\}",
        r"{\1[\2].km ?? \1[\2].en}",
        src,
    )
    return src


def main() -> None:
    fixed = 0
    for path in sorted(ROOT.rglob("*")):
        if path.suffix not in {".astro", ".tsx"}:
            continue
        src = path.read_text(encoding="utf-8")
        orig = src
        src = dedupe_lang_km(src)
        src = fix_label_refs(src)
        if src != orig:
            path.write_text(src, encoding="utf-8")
            fixed += 1
            print(f"deduped {path.relative_to(ROOT)}")
    print(f"Done. {fixed} files deduped.")


if __name__ == "__main__":
    main()
