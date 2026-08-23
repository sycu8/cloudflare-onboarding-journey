#!/usr/bin/env python3
"""Generate tutorialPreviews.km.json from tutorialPreviews.data.json."""
from __future__ import annotations

import json
import re
import sys
import threading
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "src/data/tutorialPreviews.data.json"
OUT_PATH = ROOT / "src/data/tutorialPreviews.km.json"
WORKERS = 8

PROTECTED_TERMS = sorted(
    [
        "Cloudflare",
        "Cloudflare One",
        "Cloudflare Starter Hub",
        "Orange Cloud Learning Hub",
        "Workers",
        "Workers AI",
        "Pages",
        "R2",
        "KV",
        "D1",
        "Durable Objects",
        "Hyperdrive",
        "Queues",
        "WAF",
        "Argo",
        "Argo Smart Routing",
        "Magic Transit",
        "Magic WAN",
        "Zero Trust",
        "Access",
        "Gateway",
        "Tunnel",
        "Cloudflare Tunnel",
        "Turnstile",
        "Stream",
        "Images",
        "Email Routing",
        "AI Gateway",
        "Vectorize",
        "Wrangler",
        "DevTools",
        "DNS",
        "TLS",
        "SSL",
        "HTTP",
        "HTTPS",
        "CDN",
        "API",
        "CLI",
        "JWT",
        "SSO",
        "IdP",
        "NAT",
        "TCP",
        "UDP",
        "IP",
        "IPv4",
        "IPv6",
        "VPN",
        "ZTNA",
        "SaaS",
        "DDoS",
        "Bot Management",
        "Rate Limiting",
        "Load Balancer",
        "Page Rules",
        "Cache Rules",
        "Transform Rules",
        "Origin Rules",
        "Firewall Rules",
        "Googlebot",
        "PeerPoint",
        "Get started",
    ],
    key=len,
    reverse=True,
)

CACHE: dict[str, str] = {}
CACHE_LOCK = threading.Lock()


def protect_terms(text: str) -> tuple[str, dict[str, str]]:
    placeholders: dict[str, str] = {}
    out = text
    for i, term in enumerate(PROTECTED_TERMS):
        pattern = re.compile(re.escape(term), re.IGNORECASE)

        def repl(match: re.Match[str]) -> str:
            key = f"__TERM{i}_{len(placeholders)}__"
            placeholders[key] = match.group(0)
            return key

        out = pattern.sub(repl, out)
    return out, placeholders


def restore_terms(text: str, placeholders: dict[str, str]) -> str:
    out = text
    for key, value in placeholders.items():
        out = out.replace(key, value)
    return out


MAX_QUERY_CHARS = 3500


def _split_for_translate(text: str, max_len: int = MAX_QUERY_CHARS) -> list[str]:
    if len(text) <= max_len:
        return [text]
    chunks: list[str] = []
    parts = re.split(r"(</(?:p|li|h[1-6]|div|tr|td|th|blockquote|pre|code|strong|em|a)>)", text)
    buf = ""
    for part in parts:
        candidate = buf + part
        if len(candidate) > max_len and buf:
            chunks.append(buf)
            buf = part
        else:
            buf = candidate
    if buf:
        chunks.append(buf)
    if len(chunks) == 1 and len(text) > max_len:
        for i in range(0, len(text), max_len):
            chunks.append(text[i : i + max_len])
    return chunks


def _translate_chunk(protected: str, *, retries: int = 4) -> str:
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            params = urllib.parse.urlencode(
                {
                    "client": "gtx",
                    "sl": "en",
                    "tl": "km",
                    "dt": "t",
                    "q": protected,
                }
            )
            url = f"https://translate.googleapis.com/translate_a/single?{params}"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            parts = "".join(part[0] for part in (data[0] or []) if part and part[0])
            if not parts:
                raise RuntimeError("Empty translation response")
            time.sleep(0.05)
            return parts
        except Exception as err:  # noqa: BLE001
            last_err = err
            time.sleep(0.5 * (attempt + 1))
    raise last_err or RuntimeError("Translation failed")


def translate_en_to_km(text: str, *, dry_run: bool = False) -> str:
    if not text or not str(text).strip():
        return text
    trimmed = text.strip()
    if dry_run:
        return text

    with CACHE_LOCK:
        if trimmed in CACHE:
            return CACHE[trimmed]

    chunks = _split_for_translate(trimmed)
    translated_chunks: list[str] = []
    for chunk in chunks:
        protected, placeholders = protect_terms(chunk)
        translated = _translate_chunk(protected)
        translated_chunks.append(restore_terms(translated, placeholders))

    restored = "".join(translated_chunks)
    with CACHE_LOCK:
        CACHE[trimmed] = restored
    return restored


def collect_strings(preview: dict) -> list[str]:
    strings: list[str] = []
    for key in ("title", "summaryEn", "introEn"):
        val = preview.get(key)
        if val:
            strings.append(val)
    strings.extend(preview.get("notesEn") or [])
    for section in preview.get("sections") or []:
        for key in ("title", "summaryEn"):
            val = section.get(key)
            if val:
                strings.append(val)
        for block in section.get("blocks") or []:
            if block.get("type") == "code":
                continue
            if block.get("type") in ("paragraph", "note"):
                if block.get("html"):
                    strings.append(block["html"])
            elif block.get("type") == "list":
                strings.extend(block.get("items") or [])
    return strings


def prefetch_translations(strings: list[str], dry_run: bool) -> None:
    unique = []
    seen = set()
    for s in strings:
        t = s.strip()
        if not t or t in seen:
            continue
        seen.add(t)
        with CACHE_LOCK:
            if t in CACHE:
                continue
        unique.append(s)

    if not unique or dry_run:
        return

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = [pool.submit(translate_en_to_km, s, dry_run=dry_run) for s in unique]
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as err:  # noqa: BLE001
                print(f"WARN translate failed: {err}", flush=True)


def translate_string(s: str | None, dry_run: bool) -> str | None:
    if not s:
        return s
    return translate_en_to_km(s, dry_run=dry_run)


def translate_string_array(arr: list[str] | None, dry_run: bool) -> list[str] | None:
    if not arr:
        return arr
    return [translate_en_to_km(item, dry_run=dry_run) for item in arr]


def section_overlay_key(sections: list[dict], section_index: int) -> str:
    anchor = sections[section_index]["anchor"]
    prior = sum(1 for j in range(section_index) if sections[j]["anchor"] == anchor)
    return anchor if prior == 0 else f"{anchor}#{prior + 1}"


def build_overlay(preview: dict, dry_run: bool) -> dict:
    sections_list = preview.get("sections") or []
    prefetch_translations(collect_strings(preview), dry_run)

    entry: dict = {
        "titleKm": translate_string(preview.get("title"), dry_run),
        "summaryKm": translate_string(preview.get("summaryEn"), dry_run),
        "introKm": translate_string(preview.get("introEn"), dry_run),
    }
    notes = preview.get("notesEn")
    if notes:
        entry["notesKm"] = translate_string_array(notes, dry_run)

    sections: dict = {}
    for section_index, section in enumerate(sections_list):
        sec = {
            "titleKm": translate_string(section.get("title"), dry_run),
            "summaryKm": translate_string(section.get("summaryEn"), dry_run),
            "blocks": [],
        }
        for block in section.get("blocks") or []:
            if block.get("type") == "code":
                sec["blocks"].append({"type": "code", "skip": True})
                continue
            if block.get("type") in ("paragraph", "note"):
                sec["blocks"].append(
                    {
                        "type": block["type"],
                        "htmlKm": translate_string(block.get("html"), dry_run),
                    }
                )
            elif block.get("type") == "list":
                sec["blocks"].append(
                    {
                        "type": "list",
                        "ordered": block.get("ordered"),
                        "itemsKm": translate_string_array(block.get("items"), dry_run),
                    }
                )
        sections[section_overlay_key(sections_list, section_index)] = sec

    entry["sections"] = sections
    entry["complete"] = True
    return entry


def main() -> int:
    dry_run = "--dry-run" in sys.argv
    force = "--force" in sys.argv
    only = None
    for arg in sys.argv[1:]:
        if arg.startswith("--only="):
            only = arg.split("=", 1)[1]

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    overlay: dict = {}
    if OUT_PATH.exists() and OUT_PATH.read_text(encoding="utf-8").strip() not in ("", "{}"):
        overlay = json.loads(OUT_PATH.read_text(encoding="utf-8"))

    paths = [p for p in data.keys() if not only or only in p]
    translated = 0
    skipped = 0

    for i, path in enumerate(paths, 1):
        if overlay.get(path, {}).get("complete") and not force:
            skipped += 1
            print(f"skip (done) {path}", flush=True)
            continue
        print(f"tutorial [{i}/{len(paths)}] {path}", flush=True)
        overlay[path] = build_overlay(data[path], dry_run)
        translated += 1
        OUT_PATH.write_text(json.dumps(overlay, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if translated % 10 == 0:
            print(f"checkpoint {translated} new, {skipped} skipped", flush=True)

    complete = sum(1 for p in paths if overlay.get(p, {}).get("complete"))
    print(
        f"DONE: wrote {OUT_PATH.relative_to(ROOT)} "
        f"({complete}/{len(paths)} complete, {translated} translated this run, {skipped} skipped)",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
