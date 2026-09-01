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
  'Formspree',
  'GitHub',
  'GitLab',
  'Bitbucket',
  'Node.js',
  'JavaScript',
  'TypeScript',
  'WebSocket',
  'GraphQL',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Terraform',
  'Playwright',
  'Wrangler CLI',
  'pages.dev',
  'Save and Deploy',
  'Create Form',
  'HTML',
  'CSS',
  'form',
  'action',
  'input',
  'label',
];

const sorted = [...new Set(PROTECTED_TERMS)].sort((a, b) => b.length - a.length);

export function protectTerms(text) {
  let out = text;
  const placeholders = new Map();
  sorted.forEach((term, i) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = term.includes(' ')
      ? new RegExp(escaped, 'gi')
      : new RegExp(`\\b${escaped}\\b`, 'gi');
    out = out.replace(re, (match) => {
      const key = `#T${i}_${placeholders.size}#`;
      placeholders.set(key, match);
      return key;
    });
  });
  return { text: out, placeholders };
}

export function restoreTerms(text, placeholders) {
  let out = String(text ?? '');
  for (const [key, value] of placeholders) {
    out = out.split(key).join(value);
  }
  out = out.replace(/#\s*T\s*(\d+)\s*_(\d+)\s*#/g, (full, i, n) => {
    return placeholders.get(`#T${i}_${n}#`) ?? full;
  });
  return out;
}

export function hasKhmer(text) {
  return /[\u1780-\u17FF]/.test(text);
}

/** Simple delay for rate limiting */
export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
