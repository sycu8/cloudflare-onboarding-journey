#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Adds .lang-km spans after .lang-en spans missing a paired .lang-km sibling."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"

STATIC_KM = {
    "Done": "រួចរាល់",
    "Foundation": "មូលដ្ឋាន",
    "Beginner": "អ្នកចាប់ផ្តើម",
    "Intermediate": "កម្រិតមធ្យម",
    "General knowledge": "ចំណេះទូទៅ",
    "Why it matters": "ហេតុអ្វីសំខាន់",
    "Prerequisites": "តម្រូវការជាមុន",
    "Related Cloudflare products": "ផលិតផល Cloudflare ពាក់ព័ន្ធ",
    "On this hub": "នៅលើ hub",
    "Suggested tutorials": "Tutorial ណែនាំ",
    "Suggested exercise": "លំហាត់ណែនាំ",
    "Common newbie mistakes": "កំហុសថ្មីៗញឹកញាប់",
    "Sources": "ប្រភព",
    "Mark as complete": "សម្គាល់ថារួច",
    "Complete": "រួចរាល់",
    "Topics": "ប្រធានបទ",
    "Hub links": "តំណ hub",
    "Suggested deployment tutorials": "Tutorial deploy ណែនាំ",
    "Recommended products": "ផលិតផលណែនាំ",
    "Exercises": "លំហាត់",
    "Week outcome": "លទ្ធផលសប្តាហ៍",
    "Mark week complete": "សម្គាល់សប្តាហ៍រួច",
    "From zero": "ចាប់ផ្តើមពីសូន្យ",
    "Basic": "មូលដ្ឋាន",
    "Technical": "បច្ចេកទេស",
    "Mixed": "ចម្រុះ",
    "Duration": "រយៈពេល",
    "Starting level": "កម្រិតចាប់ផ្តើម",
    "Primary track": "Track ចម្បង",
    "Outcome": "លទ្ធផល",
    "View roadmap": "មើល roadmap",
    "Learning progress": "វឌ្ឍនភាពសិក្សា",
    "Reset": "Reset",
    "Progress overview": "ទិដ្ឋភាពវឌ្ឍនភាព",
    "Export JSON": "Export JSON",
    "Content Roadmap": "Content Roadmap",
    "Active role roadmap": "Roadmap តួនាទីសកម្ម",
    "Progress by role": "វឌ្ឍនភាពតាមតួនាទី",
    "Continue learning": "បន្តសិក្សា",
    "Roadmap progress": "វឌ្ឍនភាព roadmap",
    "Start this roadmap": "ចាប់ផ្តើម roadmap",
    "Continue": "បន្ត",
    "Glossary": "Glossary",
    "Checklist": "Checklist",
    "Quiz": "Quiz",
    "Keep learning": "បន្តសិក្សា",
    "Final outcome": "លទ្ធផលចុងក្រោយ",
    "Built by": "Built by",
    "Hosted on Cloudflare Pages": "Hosted on Cloudflare Pages",
}

LABEL_KM = {
    "Foundation": "មូលដ្ឋាន",
    "Beginner": "អ្នកចាប់ផ្តើម",
    "Intermediate": "កម្រិតមធ្យម",
    "From zero": "ចាប់ផ្តើមពីសូន្យ",
    "Basic": "មូលដ្ឋាន",
    "Technical": "បច្ចេកទេស",
    "Mixed": "ចម្រុះ",
}

SPAN_RE = re.compile(
    r'(<span (?:class|className)="[^"]*\blang-en\b[^"]*">)([\s\S]*?)(</span>)'
    r'(?!\s*\n?\s*<span (?:class|className)="[^"]*\blang-km\b)',
    re.MULTILINE,
)

LEVEL_LABEL_RE = re.compile(
    r"(\w+:\s*\{\s*vi:\s*'[^']*',\s*en:\s*'([^']*)'\s*\})"
)

INLINE_OBJ_RE = re.compile(
    r"\{\s*vi:\s*('(?:\\'|[^'])*'|\"(?:\\\"|[^\"])*\")"
    r"([^}]*?)en:\s*('(?:\\'|[^'])*'|\"(?:\\\"|[^\"])*\")(\s*)\}",
    re.MULTILINE,
)


def to_km_expression(expr: str) -> str:
    e = expr.strip()
    if "Km" in e:
        return e

    e = re.sub(
        r"([\w.?[\]'\"]+)\.(\w+)En(\s*\?\?\s*\1\.\2Vi)",
        r"\1.\2Km ?? \1.\2En\3",
        e,
    )
    e = re.sub(
        r"([\w.]+)\.(\w+)En\?\.(\[[^\]]+\])\s*\?\?\s*",
        r"\1.\2Km?.\3 ?? \1.\2En?.\3 ?? ",
        e,
    )

    m = re.fullmatch(r"(\w+)\.en", e)
    if m:
        return f"{m.group(1)}.km ?? {m.group(1)}.en"

    m = re.fullmatch(r"(\w+)\.titleEn", e)
    if m:
        return f"{m.group(1)}.titleKm ?? {m.group(1)}.titleEn"

    m = re.search(r"getContentTopicTitle\(([^,]+),\s*'en'\)", e)
    if m:
        arg = m.group(1)
        return f"getContentTopicTitle({arg}, 'km') ?? getContentTopicTitle({arg}, 'en')"

    m = re.search(r"getTutorialDisplayTitle\(([^,]+),\s*'en'\)", e)
    if m:
        arg = m.group(1)
        return f"getTutorialDisplayTitle({arg}, 'km') ?? getTutorialDisplayTitle({arg}, 'en')"

    return e


def static_km(text: str) -> str:
    trimmed = text.strip()
    return STATIC_KM.get(trimmed, trimmed)


def add_km_spans(src: str) -> str:
    def repl(m: re.Match[str]) -> str:
        open_tag, inner, close_tag = m.group(1), m.group(2), m.group(3)
        offset = m.start()
        line_start = src.rfind("\n", 0, offset) + 1
        indent_match = re.match(r"(\s*)", src[line_start:offset])
        indent = indent_match.group(1) if indent_match else "      "

        trimmed = inner.strip()
        if trimmed.startswith("{") and trimmed.endswith("}"):
            km_inner = "{" + to_km_expression(trimmed[1:-1]) + "}"
        else:
            km_inner = static_km(trimmed)

        open_km = re.sub(r"\blang-en\b", "lang-km", open_tag)
        return f"{open_tag}{inner}{close_tag}\n{indent}{open_km}{km_inner}{close_tag}"

    return SPAN_RE.sub(repl, src)


def add_km_to_level_labels(src: str) -> str:
    def repl(m: re.Match[str]) -> str:
        full, en_val = m.group(1), m.group(2)
        if "km:" in full:
            return full
        km = LABEL_KM.get(en_val, en_val)
        return full[:-1] + f", km: '{km}' }}"

    return LEVEL_LABEL_RE.sub(repl, src)


def add_km_to_inline_objects(src: str) -> str:
    def repl(m: re.Match[str]) -> str:
        match = m.group(0)
        if re.search(r"\bkm\s*:", match):
            return match
        vi_part, middle, en_part, tail = m.group(1), m.group(2), m.group(3), m.group(4)
        quote = en_part[0]
        en_val = en_part[1:-1]
        km_val = STATIC_KM.get(en_val, en_val)
        escaped = km_val.replace("\\", "\\\\").replace(quote, f"\\{quote}")
        return f"{{ vi: {vi_part}{middle}en: {en_part}, km: {quote}{escaped}{quote}{tail}}}"

    return INLINE_OBJ_RE.sub(repl, src)


def main() -> None:
    updated = 0
    skip_files = {"LangText.astro"}
    for path in sorted(ROOT.rglob("*")):
        if path.suffix not in {".astro", ".tsx"}:
            continue
        if path.name in skip_files:
            continue
        src = path.read_text(encoding="utf-8")
        if "lang-en" not in src:
            continue
        orig = src
        src = add_km_to_level_labels(src)
        src = add_km_to_inline_objects(src)
        src = add_km_spans(src)
        if src != orig:
            path.write_text(src, encoding="utf-8")
            updated += 1
            print(f"updated {path.relative_to(ROOT)}")

    print(f"Done. {updated} files updated.")


if __name__ == "__main__":
    main()
