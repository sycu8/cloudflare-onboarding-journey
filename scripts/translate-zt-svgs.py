#!/usr/bin/env python3
"""Create Vietnamese copies of onboarding SVGs by replacing English labels."""
from pathlib import Path

DIR = Path("/workspace/public/images/tracks/cloudflare-one")

# Longest-first so partial replacements do not eat longer strings.
LABELS = {
    "Cloudflare Zero Trust — Complete Reference Architecture": "Cloudflare Zero Trust — Kiến trúc tham chiếu đầy đủ",
    "One global network securing every direction — your people &amp; sites reaching out, and AI reaching in": "Một mạng toàn cầu bảo vệ mọi hướng — người và site đi ra, AI đi vào",
    "MANAGEMENT &amp; OBSERVABILITY PLANE": "MẶT PHẲNG QUẢN TRỊ &amp; QUAN SÁT",
    "Identity providers": "Nhà cung cấp danh tính",
    "Entra ID · Okta · Google · SCIM": "Entra ID · Okta · Google · SCIM",
    "Admins &amp; roles": "Admin &amp; vai trò",
    "Least-privilege · break-glass": "Least-privilege · break-glass",
    "Observability": "Quan sát (observability)",
    "Logpush → SIEM · Analytics · Radar": "Logpush → SIEM · Analytics · Radar",
    "SOURCES &amp; ON-RAMPS": "NGUỒN &amp; ON-RAMP",
    "CLOUDFLARE — ONE GLOBAL NETWORK (SASE)": "CLOUDFLARE — MỘT MẠNG TOÀN CẦU (SASE)",
    "DESTINATIONS": "ĐÍCH ĐẾN",
    "Managed device": "Thiết bị quản trị",
    "WARP · Gateway mode": "WARP · Gateway mode",
    "BYOD / mobile": "BYOD / mobile",
    "Include split tunnel": "Include split tunnel",
    "Unmanaged / 3rd-party": "Không quản trị / bên thứ ba",
    "Clientless · RBI": "Clientless · RBI",
    "AI agents / MCP clients": "AI agent / MCP client",
    "Managed OAuth · tokens": "Managed OAuth · token",
    "Branch office": "Chi nhánh",
    "Cloudflare WAN Appliance": "Cloudflare WAN Appliance",
    "Data center / cloud": "Data center / cloud",
    "IPsec · GRE · CNI · Mesh": "IPsec · GRE · CNI · Mesh",
    "Identity &amp; Device Posture": "Danh tính &amp; Device Posture",
    "Who is the user? Is the device healthy?": "User là ai? Thiết bị có khỏe không?",
    "Access — ZTNA (per application)": "Access — ZTNA (theo ứng dụng)",
    "Least-privilege access, replaces VPN": "Truy cập least-privilege, thay VPN",
    "Gateway SWG — DNS · Network · HTTP + TLS": "Gateway SWG — DNS · Network · HTTP + TLS",
    "Block threats &amp; filter all web traffic": "Chặn mối đe dọa &amp; lọc toàn bộ web traffic",
    "Shadow IT Discovery": "Khám phá Shadow IT",
    "See &amp; approve every SaaS / AI app in use": "Xem &amp; duyệt mọi SaaS / AI app đang dùng",
    "Browser Isolation (RBI)": "Cách ly trình duyệt (RBI)",
    "Run risky sites in a remote browser": "Chạy site rủi ro trong remote browser",
    "Data Loss Prevention (DLP)": "Ngăn mất dữ liệu (DLP)",
    "Detect &amp; stop sensitive data — incl. AI prompts": "Phát hiện &amp; chặn dữ liệu nhạy cảm — gồm AI prompt",
    "AI Controls · MCP Portals · AI Gateway": "AI Controls · MCP Portal · AI Gateway",
    "Govern AI apps, prompts, agent tools &amp; API calls": "Quản trị AI app, prompt, tool agent &amp; API call",
    "Egress control": "Kiểm soát egress",
    "Dedicated egress IPs · IP-version control": "Dedicated egress IP · kiểm soát phiên bản IP",
    "Magic Firewall (network L3/L4)": "Magic Firewall (mạng L3/L4)",
    "Filter whole-site &amp; data-center traffic": "Lọc traffic cả site &amp; data center",
    "Internet &amp; SaaS": "Internet &amp; SaaS",
    "Filtered &amp; inspected": "Đã lọc &amp; inspect",
    "Private apps": "App nội bộ",
    "via Tunnel · ZTNA": "qua Tunnel · ZTNA",
    "AI models &amp; MCP servers": "AI model &amp; MCP server",
    "Governed &amp; logged per tool": "Được quản trị &amp; ghi log theo tool",
    "encrypted": "mã hóa",
    "policy-checked": "đã kiểm policy",
    "Single pass close to the user: connect → verify → filter → route → log": "Một lượt gần user: kết nối → xác minh → lọc → định tuyến → ghi log",
    "INBOUND — THE AGENTIC INTERNET (protect your content &amp; AI apps)": "CHIỀU VÀO — AGENTIC INTERNET (bảo vệ content &amp; AI app)",
    "AI crawlers &amp; bots": "AI crawler &amp; bot",
    "GPTBot · ClaudeBot · Bytespider": "GPTBot · ClaudeBot · Bytespider",
    "AI Crawl Control · WAF": "AI Crawl Control · WAF",
    "allow · block · charge · AI Security for Apps": "allow · block · charge · AI Security for Apps",
    "Your content &amp; AI apps": "Content &amp; AI app của bạn",
    "monetize via Pay Per Crawl": "kiếm tiền qua Pay Per Crawl",
    "Cloudflare Zero Trust — Onboarding Workflow": "Cloudflare Zero Trust — Quy trình onboarding",
    "Follow the modules in order · pilot → validate → expand at every phase": "Làm module theo thứ tự · pilot → validate → expand mọi phase",
    "Foundation": "Nền tảng",
    "Account setup": "Thiết lập tài khoản",
    "Account admin": "Quản trị tài khoản",
    "Identity provider": "Nhà cung cấp danh tính",
    "Devices": "Thiết bị",
    "Device enrollment": "Đăng ký thiết bị",
    "Device profiles": "Hồ sơ thiết bị",
    "Posture checks": "Kiểm tra posture",
    "Access": "Access",
    "ZTNA (Access)": "ZTNA (Access)",
    "Connectors": "Connectors",
    "Web filtering": "Lọc web",
    "Gateway": "Gateway",
    "Egress &amp; IP": "Egress &amp; IP",
    "Isolation": "Cách ly",
    "Shadow IT": "Shadow IT",
    "Data &amp; AI": "Dữ liệu &amp; AI",
    "AI controls": "Kiểm soát AI",
    "Secure AI &amp; MCP": "Bảo mật AI &amp; MCP",
    "Network": "Mạng",
    "Cloudflare WAN": "Cloudflare WAN",
    "Go-live": "Go-live",
    "Logpush to SIEM  ·  Validate with pilot group  ·  Expand company-wide  ·  Retire the old VPN": "Logpush tới SIEM  ·  Kiểm với nhóm pilot  ·  Mở rộng toàn công ty  ·  Nghỉ VPN cũ",
    "◀ At every phase: pilot → validate → expand": "◀ Mọi phase: pilot → validate → expand",
    "AI &amp; MCP Security — Defense in Depth": "Bảo mật AI &amp; MCP — Defense in Depth",
    "Discover, control and protect every AI interaction — from browser prompts to autonomous MCP agents": "Khám phá, kiểm soát và bảo vệ mọi tương tác AI — từ prompt trình duyệt đến MCP agent tự trị",
    "WHO / WHAT": "NGƯỜI / THỨ GÌ",
    "Users — browser AI": "User — AI trên trình duyệt",
    "ChatGPT, Gemini…": "ChatGPT, Gemini…",
    "Claude, Cursor, CLIs": "Claude, Cursor, CLI",
    "CLOUDFLARE — AI SECURITY LAYERS": "CLOUDFLARE — CÁC LỚP BẢO MẬT AI",
    "Discover shadow AI": "Khám phá shadow AI",
    "Find every AI app in use + who uses it": "Tìm mọi AI app đang dùng + ai dùng",
    "Control AI apps": "Kiểm soát AI app",
    "Allow approved + guardrails · block/isolate rest": "Allow đã duyệt + guardrail · block/isolate phần còn lại",
    "Protect prompts (DLP)": "Bảo vệ prompt (DLP)",
    "Scan prompts for PII, secrets, source code": "Quét prompt tìm PII, secret, source code",
    "Govern MCP agents": "Quản trị MCP agent",
    "MCP portals · Managed OAuth · per-tool logging": "MCP portal · Managed OAuth · log theo tool",
    "AI DESTINATIONS": "ĐÍCH AI",
    "AI models": "AI model",
    "ChatGPT · Gemini · Claude": "ChatGPT · Gemini · Claude",
    "MCP servers": "MCP server",
    "tools &amp; data, logged": "tool &amp; dữ liệu, đã log",
    "For AI apps YOU build": "Với AI app BẠN xây",
    "AI Security for Apps (WAF) — prompt-injection &amp; unsafe-topic detection  ·  Browser Isolation shields risky AI in a remote browser": "AI Security for Apps (WAF) — phát hiện prompt-injection &amp; chủ đề không an toàn  ·  Browser Isolation che AI rủi ro trong remote browser",
}

# PHASE n stays as PHASE (diagram layout). Translate the word PHASE:
LABELS["PHASE 1"] = "PHASE 1"
LABELS["PHASE 2"] = "PHASE 2"
LABELS["PHASE 3"] = "PHASE 3"
LABELS["PHASE 4"] = "PHASE 4"
LABELS["PHASE 5"] = "PHASE 5"
LABELS["PHASE 6"] = "PHASE 6"

def translate_svg(name: str) -> None:
    src = DIR / name
    text = src.read_text()
    # Sort by length descending
    for en, vi in sorted(LABELS.items(), key=lambda kv: len(kv[0]), reverse=True):
        if en != vi:
            text = text.replace(f">{en}<", f">{vi}<")
    dest = DIR / name.replace(".svg", ".vi.svg")
    dest.write_text(text)
    print(f"wrote {dest.name} ({dest.stat().st_size} bytes)")

for n in ("architecture.svg", "workflow.svg", "aisecurity.svg"):
    translate_svg(n)
