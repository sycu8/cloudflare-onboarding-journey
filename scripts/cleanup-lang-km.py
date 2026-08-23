#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Normalize lang-en/lang-km pairs: one km after each en, correct expressions."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"

# lang-en accidentally got km fallback in label refs
FIX_EN_LABELS = re.compile(
    r'(<span (?:class|className)="[^"]*\blang-en\b[^"]*">)\{'
    r'(levelLabels|trackLabels)\[([^\]]+)\]\.km \?\? \2\[\3\]\.en\}(</span>)'
)
FIX_EN_LABELS_REPL = r'\1{\2[\3].en}\4'

# Remove extra lang-km spans before next lang-vi or structural close
EXTRA_KM = re.compile(
    r'(<span (?:class|className)="[^"]*\blang-km\b[^"]*">[\s\S]*?</span>\s*\n\s*)'
    r'(?=<span (?:class|className)="[^"]*\blang-km\b)'
)

LANGTEXT = re.compile(
    r'(<span class="lang-km">\{text\.km \?\? text\.en\}</span>\s*)'
    r'(?:<span class="lang-km">\{text\.en\}</span>\s*)?'
    r'(?:<span class="lang-km">\{text\.km \?\? text\.en\}</span>\s*)?'
)


def cleanup(src: str) -> str:
    src = FIX_EN_LABELS.sub(FIX_EN_LABELS_REPL, src)
    if "LangText.astro" in src or True:
        pass
    prev = None
    while prev != src:
        prev = src
        src = EXTRA_KM.sub("", src)
    # strip trailing blank lines inside elements after last lang-km
    src = re.sub(r'(<span class="lang-km">[\s\S]*?</span>)\s*\n\s*\n\s*\n', r"\1\n", src)
    return src


def main() -> None:
    fixed = 0
    for path in sorted(ROOT.rglob("*")):
        if path.suffix not in {".astro", ".tsx"}:
            continue
        src = path.read_text(encoding="utf-8")
        orig = src
        src = cleanup(src)
        if path.name == "LangText.astro":
            src = LANGTEXT.sub(r"\1", src)
        if src != orig:
            path.write_text(src, encoding="utf-8")
            fixed += 1
            print(f"cleaned {path.relative_to(ROOT)}")
    print(f"Done. {fixed} files cleaned.")


if __name__ == "__main__":
    main()
