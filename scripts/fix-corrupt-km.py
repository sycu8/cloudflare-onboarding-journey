#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"

# {topic ?? topic.titleVi ?? topic.titleEn ?? topic.titleVi}
CORRUPT = re.compile(
    r"\{(\w+) \?\? \1\.(\w+)Vi \?\? \1\.\2En \?\? \1\.\2Vi\}"
)
CORRUPT_REPL = r"{\1.\2Km ?? \1.\2En ?? \1.\2Vi}"

LEVEL_LABELS = re.compile(
    r"\{levelLabels\[(\w+)\]\.en\}"
)
LEVEL_LABELS_REPL = r"{levelLabels[\1].km ?? levelLabels[\1].en}"


def main() -> None:
    fixed = 0
    for path in sorted(ROOT.rglob("*")):
        if path.suffix not in {".astro", ".tsx"}:
            continue
        src = path.read_text(encoding="utf-8")
        orig = src
        src = CORRUPT.sub(CORRUPT_REPL, src)
        src = LEVEL_LABELS.sub(LEVEL_LABELS_REPL, src)
        if src != orig:
            path.write_text(src, encoding="utf-8")
            fixed += 1
            print(f"fixed {path.relative_to(ROOT)}")
    print(f"Done. {fixed} files fixed.")


if __name__ == "__main__":
    main()
