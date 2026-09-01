#!/usr/bin/env python3
"""Parse labs.cloudflare.dev HTML into src/data/developerLabs.articles.data.json.

Usage:
  python3 scripts/import-developer-labs.py
  python3 scripts/import-developer-labs.py --fetch
"""
from __future__ import annotations

import argparse
import html as htmlmod
import json
import re
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "scripts" / "cache" / "developer-labs"
OUT = ROOT / "src" / "data" / "developerLabs.articles.data.json"

TRACKS = [
    ("workers", "https://labs.cloudflare.dev/workers", "01-workers"),
    ("mcp", "https://labs.cloudflare.dev/mcp", "02-mcp"),
    ("agents", "https://labs.cloudflare.dev/agents", "03-agents"),
    ("sandbox-sdk", "https://labs.cloudflare.dev/sandbox-sdk", "04-sandbox"),
]

UA = "OrangeCloud-Learning-Hub/1.0 (developer-labs-import)"


def slugify(text: str) -> str:
    s = htmlmod.unescape(text).lower()
    s = re.sub(r"['’]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:80]


def inner_of(html: str, start_idx: int) -> tuple[str, int]:
    tag_m = re.match(r"<([a-zA-Z0-9]+)", html[start_idx:])
    if not tag_m:
        return "", start_idx + 1
    tag = tag_m.group(1).lower()
    open_end = html.find(">", start_idx)
    if open_end < 0:
        return "", len(html)
    if html.startswith("/>", open_end - 1) or html[open_end - 1] == "/":
        # void-ish
        if tag in {"br", "img", "hr", "input", "meta", "link"}:
            return "", open_end + 1
    i = open_end + 1
    depth = 1
    pat = re.compile(rf"</?{tag}\b", re.I)
    while depth and i < len(html):
        m = pat.search(html, i)
        if not m:
            return html[open_end + 1 :], len(html)
        is_close = html[m.start() + 1] == "/"
        gt = html.find(">", m.end())
        if gt < 0:
            return html[open_end + 1 :], len(html)
        selfclose = html[gt - 1] == "/"
        if is_close:
            depth -= 1
            if depth == 0:
                return html[open_end + 1 : m.start()], gt + 1
        elif not selfclose:
            depth += 1
        i = gt + 1
    return html[open_end + 1 :], len(html)


def strip_tags(s: str) -> str:
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</p>", "\n", s, flags=re.I)
    s = re.sub(r"<li[^>]*>", "• ", s, flags=re.I)
    s = re.sub(r"</li>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = htmlmod.unescape(s)
    return re.sub(r"[ \t]+\n", "\n", s).strip()


def inline_html(html: str) -> str:
    """Keep a/code/strong/em; drop the rest."""
    html = re.sub(r"<br\s*/?>", "\n", html, flags=re.I)

    def repl_a(m: re.Match) -> str:
        href = m.group(1)
        inner = inline_html(m.group(2))
        if href.startswith("#"):
            return inner
        return (
            f'<a href="{htmlmod.escape(href, quote=True)}" class="link" '
            f'target="_blank" rel="noopener noreferrer">{inner}</a>'
        )

    html = re.sub(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', repl_a, html, flags=re.S | re.I)
    html = re.sub(r"<code[^>]*>(.*?)</code>", r"<code>\1</code>", html, flags=re.S | re.I)
    html = re.sub(r"<strong[^>]*>(.*?)</strong>", r"<strong>\1</strong>", html, flags=re.S | re.I)
    html = re.sub(r"<b\b[^>]*>(.*?)</b>", r"<strong>\1</strong>", html, flags=re.S | re.I)
    html = re.sub(r"<em[^>]*>(.*?)</em>", r"<em>\1</em>", html, flags=re.S | re.I)
    html = re.sub(r"<[^>]+>", "", html)
    # unescape then re-escape except our tags
    text = htmlmod.unescape(html)
    # protect tags
    placeholders: list[str] = []

    def hold(m: re.Match) -> str:
        placeholders.append(m.group(0))
        return f"§T{len(placeholders) - 1}§"

    held = re.sub(r"</?(?:a|code|strong|em)(?:\s[^>]*)?>", hold, text)
    held = htmlmod.escape(held)
    for i, raw in enumerate(placeholders):
        held = held.replace(f"§T{i}§", raw)
    return held.strip()


def extract_code_from_pre(pre_html: str) -> tuple[str, str]:
    lang_m = re.search(r'data-language="([^"]+)"', pre_html)
    lang = (lang_m.group(1) if lang_m else "txt") or "txt"
    if lang in {"plaintext", "text", "ansi"}:
        lang = "txt"
    lines: list[str] = []
    for m in re.finditer(r'<span class="line"', pre_html):
        inner, _end = inner_of(pre_html, m.start())
        text = htmlmod.unescape(re.sub(r"<[^>]+>", "", inner))
        lines.append(text)
    if lines:
        return lang, "\n".join(lines).rstrip("\n")
    inner = re.sub(r"^<pre[^>]*>", "", pre_html)
    inner = re.sub(r"</pre>\s*$", "", inner)
    inner = re.sub(r"^<code[^>]*>", "", inner)
    inner = re.sub(r"</code>\s*$", "", inner)
    return lang, htmlmod.unescape(re.sub(r"<[^>]+>", "", inner)).strip("\n")


def parse_list_items_text(ul_html: str) -> list[str]:
    items = []
    for m in re.finditer(r"<li\b[^>]*>(.*?)</li>", ul_html, re.S | re.I):
        t = strip_tags(m.group(1))
        if t:
            items.append(t)
    return items


def parse_list_items_html(ul_html: str) -> list[str]:
    items = []
    for m in re.finditer(r"<li\b[^>]*>(.*?)</li>", ul_html, re.S | re.I):
        t = inline_html(m.group(1))
        if t:
            items.append(t)
    return items


def callout_kind(cls: str) -> str:
    for k in ("tip", "caution", "warning", "important", "danger", "tool", "globe", "note"):
        if f"callout-{k}" in cls:
            return k
    return "note"


def parse_blocks(html: str) -> list[dict]:
    blocks: list[dict] = []
    i = 0
    n = len(html)
    while i < n:
        if html[i].isspace():
            i += 1
            continue
        if html[i] != "<":
            i += 1
            continue
        m = re.match(
            r"<(h[1-6]|p|ul|ol|pre|div|iframe|blockquote|nav|script)\b([^>]*)>",
            html[i:],
            re.I,
        )
        if not m:
            gt = html.find(">", i)
            i = n if gt < 0 else gt + 1
            continue
        tag = m.group(1).lower()
        attrs = m.group(2) or ""
        if tag in {"nav", "script"}:
            _, end = inner_of(html, i)
            i = end
            continue
        inner, end = inner_of(html, i)

        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            text = strip_tags(inner)
            if text:
                blocks.append({"type": "heading", "level": min(int(tag[1]), 4), "text": text})
        elif tag == "pre":
            lang, code = extract_code_from_pre(html[i:end])
            if code.strip():
                blocks.append({"type": "code", "lang": lang, "code": code})
        elif tag == "iframe":
            src_m = re.search(r'src="([^"]+)"', attrs)
            title_m = re.search(r'title="([^"]*)"', attrs)
            src = src_m.group(1) if src_m else ""
            if "youtube" in src:
                blocks.append(
                    {
                        "type": "youtube",
                        "src": src,
                        "title": htmlmod.unescape(title_m.group(1)) if title_m else "YouTube",
                    }
                )
        elif tag == "div":
            cls = ""
            cls_m = re.search(r'class="([^"]*)"', attrs)
            if cls_m:
                cls = cls_m.group(1)
            if "youtube-embed" in cls or "video-wrapper" in cls:
                blocks.extend(parse_blocks(inner))
            elif "step-context" in cls:
                items = []
                for cm in re.finditer(
                    r'<div class="context-item[^"]*"[^>]*>\s*'
                    r'<span class="context-label[^"]*"[^>]*>(.*?)</span>\s*'
                    r'<div class="context-content[^"]*"[^>]*>(.*?)</div>',
                    inner,
                    re.S,
                ):
                    label = strip_tags(cm.group(1))
                    content = inline_html(cm.group(2))
                    if label or content:
                        items.append({"label": label, "html": content})
                if items:
                    blocks.append({"type": "context", "items": items})
                else:
                    text = inline_html(inner)
                    if strip_tags(inner):
                        blocks.append(
                            {"type": "context", "items": [{"label": "", "html": text}]}
                        )
            elif "callout-content" in cls or "callout-header" in cls:
                blocks.extend(parse_blocks(inner))
            elif re.search(r"\bcallout\b", cls):
                kind = callout_kind(cls)
                title_m = re.search(
                    r'<span class="callout-title[^"]*"[^>]*>(.*?)</span>', inner, re.S
                )
                content_m = re.search(
                    r'<div class="callout-content[^"]*"[^>]*>(.*)', inner, re.S
                )
                title = strip_tags(title_m.group(1)) if title_m else ""
                body_html = content_m.group(1) if content_m else inner
                # trim extra closing divs — parse as blocks
                inner_blocks = parse_blocks(body_html)
                html_parts = []
                nested: list[dict] = []
                for b in inner_blocks:
                    if b["type"] == "p":
                        html_parts.append(b["html"])
                    elif b["type"] == "list":
                        tag_l = "ol" if b["ordered"] else "ul"
                        lis = "".join(f"<li>{it}</li>" for it in b["items"])
                        html_parts.append(f"<{tag_l}>{lis}</{tag_l}>")
                    elif b["type"] == "heading":
                        html_parts.append(f"<p><strong>{htmlmod.escape(b['text'])}</strong></p>")
                    else:
                        nested.append(b)
                html_body = "\n".join(html_parts).strip()
                if title or html_body:
                    blocks.append({"type": "callout", "kind": kind, "title": title, "html": html_body})
                blocks.extend(nested)
            elif "challenge" in cls and "challenge-" not in cls:
                title_m = re.search(
                    r'<span class="challenge-title[^"]*"[^>]*>(.*?)</span>', inner, re.S
                )
                body_m = re.search(
                    r'<div class="challenge-body[^"]*"[^>]*>(.*)', inner, re.S
                )
                title = strip_tags(title_m.group(1)) if title_m else "Challenge"
                body_src = body_m.group(1) if body_m else inner
                inner_blocks = parse_blocks(body_src)
                html_parts = []
                for b in inner_blocks:
                    if b["type"] == "p":
                        html_parts.append(b["html"])
                    elif b["type"] == "list":
                        tag_l = "ol" if b["ordered"] else "ul"
                        lis = "".join(f"<li>{it}</li>" for it in b["items"])
                        html_parts.append(f"<{tag_l}>{lis}</{tag_l}>")
                blocks.append(
                    {
                        "type": "challenge",
                        "title": title,
                        "html": "\n".join(html_parts).strip(),
                    }
                )
            else:
                blocks.extend(parse_blocks(inner))
        elif tag in {"ul", "ol"}:
            items = parse_list_items_html(inner)
            if items:
                blocks.append({"type": "list", "ordered": tag == "ol", "items": items})
        elif tag == "p":
            text = inline_html(inner)
            if strip_tags(inner):
                blocks.append({"type": "p", "html": text})
        elif tag == "blockquote":
            text = inline_html(inner)
            if strip_tags(inner):
                blocks.append({"type": "callout", "kind": "note", "title": "", "html": text})
        i = end
    return blocks


def parse_lab(lab_html: str, idx: int, source_url: str, duration_min: int | None) -> dict:
    header_m = re.search(r'<div class="lab-header">(.*?)</div>\s*<div class="lab-steps">', lab_html, re.S)
    header_html = header_m.group(1) if header_m else ""
    title_m = re.search(r"<h1>(.*?)</h1>", header_html, re.S)
    desc_m = re.search(r'<p class="lab-description">(.*?)</p>', header_html, re.S)
    prereq_m = re.search(r'<div class="prerequisites">.*?<ul>(.*?)</ul>', header_html, re.S)
    obj_m = re.search(
        r'<div class="(?:learning-objectives|objectives)">.*?<ul>(.*?)</ul>',
        header_html,
        re.S,
    )
    md_m = re.search(r'<div class="step-content-markdown">(.*)', lab_html, re.S)
    md_html = md_m.group(1) if md_m else ""
    # Cut navigation / scripts if they leaked
    md_html = re.split(r'<nav class="step-navigation', md_html, maxsplit=1)[0]
    blocks = parse_blocks(md_html)
    title = htmlmod.unescape(strip_tags(title_m.group(1))) if title_m else f"Step {idx}"
    slug = f"{idx:02d}-{slugify(title)}"
    return {
        "id": slug,
        "step": idx,
        "sourceUrl": source_url,
        "durationMin": duration_min,
        "title": title,
        "description": htmlmod.unescape(strip_tags(desc_m.group(1))) if desc_m else "",
        "prerequisites": parse_list_items_text(prereq_m.group(1)) if prereq_m else [],
        "objectives": parse_list_items_text(obj_m.group(1)) if obj_m else [],
        "blocks": blocks,
    }


def split_steps(html: str) -> list[str]:
    starts = [m.start() for m in re.finditer(r'<div class="step-content"', html)]
    chunks = []
    for i, start in enumerate(starts):
        inner, end = inner_of(html, start)
        chunks.append(html[start:end])
    return chunks


def parse_track(html: str, slug: str, page_url: str, source_path: str) -> list[dict]:
    names = [htmlmod.unescape(x) for x in re.findall(r'<span class="lab-name">([^<]+)</span>', html)]
    durs = []
    for d in re.findall(r'<span class="lab-duration">([^<]+)</span>', html):
        mm = re.search(r"(\d+)", d)
        durs.append(int(mm.group(1)) if mm else None)
    chunks = split_steps(html)
    labs = []
    for i, chunk in enumerate(chunks, 1):
        dur = durs[i - 1] if i - 1 < len(durs) else None
        source_url = f"{page_url}#step-{i}"
        lab = parse_lab(chunk, i, source_url, dur)
        if names and i - 1 < len(names) and not lab["title"]:
            lab["title"] = names[i - 1]
            lab["id"] = f"{i:02d}-{slugify(lab['title'])}"
        n_code = sum(1 for b in lab["blocks"] if b["type"] == "code")
        n_p = sum(1 for b in lab["blocks"] if b["type"] == "p")
        print(
            f"  [{slug}] {lab['id']} dur={lab['durationMin']} "
            f"blocks={len(lab['blocks'])} p={n_p} code={n_code} "
            f"title={lab['title'][:48]!r}"
        )
        labs.append(lab)
    return labs


def fetch_html(url: str) -> str:
    ctx = ssl.create_default_context()
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, context=ctx, timeout=60) as res:
        return res.read().decode("utf-8", errors="replace")


def load_html(slug: str, url: str, do_fetch: bool) -> str:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f"{slug}.html"
    tmp = Path(f"/tmp/cf-labs/{slug}.html")
    if do_fetch:
        print("fetch", url)
        html = fetch_html(url)
        path.write_text(html, encoding="utf-8")
        return html
    if path.exists():
        return path.read_text(encoding="utf-8", errors="replace")
    if tmp.exists():
        html = tmp.read_text(encoding="utf-8", errors="replace")
        path.write_text(html, encoding="utf-8")
        return html
    print("fetch", url)
    html = fetch_html(url)
    path.write_text(html, encoding="utf-8")
    return html


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--fetch", action="store_true")
    args = ap.parse_args()
    out: dict = {"source": "https://labs.cloudflare.dev/", "tracks": {}}
    for slug, url, folder in TRACKS:
        print("===", slug)
        html = load_html(slug, url, args.fetch)
        out["tracks"][slug] = parse_track(html, slug, url, folder)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote", OUT, "bytes", OUT.stat().st_size)


if __name__ == "__main__":
    main()
