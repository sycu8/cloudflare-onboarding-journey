/** Cloudflare product names and IT terms kept in English during Khmer translation. */
export const PROTECTED_TERMS = [
  'Cloudflare',
  'Cloudflare One',
  'Cloudflare Starter Hub',
  'Orange Cloud Learning Hub',
  'Workers',
  'Workers AI',
  'Pages',
  'R2',
  'KV',
  'D1',
  'Durable Objects',
  'Hyperdrive',
  'Queues',
  'WAF',
  'Argo',
  'Argo Smart Routing',
  'Magic Transit',
  'Magic WAN',
  'Zero Trust',
  'Access',
  'Gateway',
  'Tunnel',
  'Cloudflare Tunnel',
  'Turnstile',
  'Stream',
  'Images',
  'Email Routing',
  'AI Gateway',
  'Vectorize',
  'Wrangler',
  'DevTools',
  'DNS',
  'TLS',
  'SSL',
  'HTTP',
  'HTTPS',
  'CDN',
  'API',
  'CLI',
  'JWT',
  'SSO',
  'IdP',
  'NAT',
  'TCP',
  'UDP',
  'IP',
  'IPv4',
  'IPv6',
  'VPN',
  'ZTNA',
  'SaaS',
  'DDoS',
  'Bot Management',
  'Rate Limiting',
  'Load Balancer',
  'Page Rules',
  'Cache Rules',
  'Transform Rules',
  'Origin Rules',
  'Firewall Rules',
  'Googlebot',
  'PeerPoint',
  'Get started',
  'Hello World',
  'API Shield',
  'Waiting Room',
  'Load Balancing',
  'Origin CA',
  'Full (strict)',
  'Always Use HTTPS',
  'workers.dev',
  'wrangler.jsonc',
  'create-cloudflare',
  'C3',
  'Turnstile',
  'Authenticated Origin Pulls',
];

const sorted = [...PROTECTED_TERMS].sort((a, b) => b.length - a.length);

export function protectTerms(text) {
  let out = text;
  const placeholders = new Map();
  sorted.forEach((term, i) => {
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    out = out.replace(re, (match) => {
      const key = `__TERM${i}_${placeholders.size}__`;
      placeholders.set(key, match);
      return key;
    });
  });
  return { text: out, placeholders };
}

export function restoreTerms(text, placeholders) {
  let out = text;
  for (const [key, value] of placeholders) {
    out = out.split(key).join(value);
  }
  return out;
}

export function hasKhmer(text) {
  return /[\u1780-\u17FF]/.test(text);
}

/** Simple delay for rate limiting */
export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
