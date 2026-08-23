#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix incorrect Km fallback chains and duplicate lang-km spans."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"

# Wrong: fooKm ?? fooVi ?? fooEn ?? fooVi  ->  fooKm ?? fooEn ?? fooVi
BAD_CHAIN = re.compile(
    r"(\{[^{}]*?)(\w+)\.(\w+)Km(\s*\?\?\s*\2\.\3Vi\s*\?\?\s*\2\.\3En\s*\?\?\s*\2\.\3Vi)([^{}]*?\})"
)

# Also fix without braces for className spans
BAD_CHAIN_BARE = re.compile(
    r"(\w+)\.(\w+)Km(\s*\?\?\s*\1\.\2Vi\s*\?\?\s*\1\.\2En\s*\?\?\s*\1\.\2Vi)"
)

GOOD_REPL = r"\1.\2Km ?? \1.\2En ?? \1.\2Vi"

LANGTEXT_DUP = re.compile(
    r'(<span class="lang-km">\{text\.km \?\? text\.en\}</span>\s*)'
    r'<span class="lang-km">\{text\.en\}</span>\s*'
    r'<span class="lang-km">\{text\.km \?\? text\.en\}</span>'
)


def fix_file(path: Path) -> bool:
    src = path.read_text(encoding="utf-8")
    orig = src

    src = BAD_CHAIN.sub(lambda m: m.group(1) + BAD_CHAIN_BARE.sub(GOOD_REPL, m.group(2) + m.group(4)) + m.group(5), src)
    src = BAD_CHAIN_BARE.sub(GOOD_REPL, src)

    if path.name == "LangText.astro":
        src = LANGTEXT_DUP.sub(r'\1', src)
        # Keep only one lang-km line
        src = re.sub(
            r'(<span class="lang-km">\{text\.km \?\? text\.en\}</span>\s*)'
            r'<span class="lang-km">\{text\.en\}</span>\s*',
            r"\1",
            src,
        )

    # levelLabels: use km field when present
    src = re.sub(
        r'\{levelLabels\[(\w+)\]\.en\}',
        r"{levelLabels[\1].km ?? levelLabels[\1].en}",
        src,
    )

    if src != orig:
        path.write_text(src, encoding="utf-8")
        return True
    return False


def main() -> None:
    fixed = 0
    for path in sorted(ROOT.rglob("*")):
        if path.suffix not in {".astro", ".tsx"}:
            continue
        if fix_file(path):
            fixed += 1
            print(f"fixed {path.relative_to(ROOT)}")
    print(f"Done. {fixed} files fixed.")


if __name__ == "__main__":
    main()
