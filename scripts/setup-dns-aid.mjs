/**
 * Create DNS-AID records in Cloudflare for onboarding.orangecloud.vn
 * Uses the `cf` CLI (CLOUDFLARE_API_TOKEN or `cf auth login`).
 * Token needs Zone.DNS Edit on orangecloud.vn.
 *
 * Usage:
 *   node scripts/setup-dns-aid.mjs [--dry-run] [--print-zone]
 */
import { cf, cfBody, ensureCfAuth, CfError } from './lib/cf.mjs';

const ZONE_NAME = 'orangecloud.vn';
const ORIGIN = (process.env.PUBLIC_SITE_URL || 'https://onboarding.orangecloud.vn').replace(/\/$/, '');
const HOST = new URL(ORIGIN).hostname;
const SUB = HOST.endsWith(`.${ZONE_NAME}`) ? HOST.slice(0, -(ZONE_NAME.length + 1)) : HOST;
const dryRun = process.argv.includes('--dry-run');
const printZone = process.argv.includes('--print-zone');

const records = [
  {
    type: 'HTTPS',
    name: `_index._agents.${SUB}`,
    data: {
      priority: 1,
      target: HOST,
      value: 'alpn=h2,h3 port=443 mandatory=alpn,port',
    },
    comment: 'DNS-AID index (alias to site origin)',
  },
  {
    type: 'HTTPS',
    name: `_a2a._agents.${SUB}`,
    data: {
      priority: 1,
      target: HOST,
      value: 'alpn=a2a,h2,h3 port=443 mandatory=alpn,port',
    },
    comment: 'DNS-AID A2A entrypoint',
  },
  {
    type: 'HTTPS',
    name: `_mcp._agents.${SUB}`,
    data: {
      priority: 1,
      target: HOST,
      value: 'alpn=mcp,h2,h3 port=443 mandatory=alpn,port',
    },
    comment: 'DNS-AID MCP entrypoint',
  },
  {
    type: 'TXT',
    name: `_index._agents.${SUB}`,
    content: `api-catalog=${ORIGIN}/.well-known/api-catalog`,
    comment: 'DNS-AID api-catalog hint (TXT fallback)',
  },
];

const bindZone = () => {
  const lines = [
    `; DNS-AID for ${HOST} — paste into orangecloud.vn zone or import`,
    `; Enable DNSSEC: Cloudflare Dashboard → DNS → Settings`,
    '',
  ];
  for (const rec of records) {
    const fqdn = `${rec.name}.${ZONE_NAME}.`;
    if (rec.type === 'HTTPS') {
      const { priority, target, value } = rec.data;
      const targetFqdn = target === '.' ? '.' : `${target}.`;
      lines.push(`${fqdn} 3600 IN HTTPS ${priority} ${targetFqdn} ${value}`);
    } else {
      lines.push(`${fqdn} 3600 IN TXT "${rec.content}"`);
    }
  }
  return lines.join('\n');
};

if (printZone) {
  console.log(bindZone());
  process.exit(0);
}

if (dryRun) {
  console.log(bindZone());
  console.log('\n(dry-run: no API calls; set CLOUDFLARE_API_TOKEN or `cf auth login`, then omit --dry-run)');
  process.exit(0);
}

try {
  ensureCfAuth();

  const zones = /** @type {Array<{ id: string; name: string }>} */ (
    cf(['zones', 'list', '--name', ZONE_NAME])
  );
  const zone = Array.isArray(zones) ? zones[0] : null;
  if (!zone) throw new Error(`Zone not found: ${ZONE_NAME}`);
  console.log(`Zone ${zone.name} (${zone.id})`);

  for (const rec of records) {
    const qname = `${rec.name}.${ZONE_NAME}`;
    let existing;
    try {
      existing = cf(
        ['dns', 'records', 'list', '--type', rec.type, '--name', qname],
        { zone: zone.id },
      );
    } catch (e) {
      if (e instanceof CfError && (e.code === 10000 || /Authentication error|403/i.test(e.message))) {
        console.error('\nAPI token lacks Zone.DNS Edit. Add records manually:\n');
        console.log(bindZone());
        process.exit(1);
      }
      throw e;
    }

    const list = Array.isArray(existing) ? existing : existing ? [existing] : [];
    if (list.length) {
      console.log(`✓ exists ${rec.type} ${qname}`);
      continue;
    }

    const body =
      rec.type === 'HTTPS'
        ? { type: 'HTTPS', name: rec.name, data: rec.data, comment: rec.comment, ttl: 3600, proxied: false }
        : { type: 'TXT', name: rec.name, content: rec.content, comment: rec.comment, ttl: 3600 };

    cfBody(['dns', 'records', 'create'], body, { zone: zone.id });
    console.log(`✓ created ${rec.type} ${qname}`);
  }

  console.log('\nEnable DNSSEC: Dashboard → DNS → Settings → DNSSEC → Enable');
  console.log('Verify: npm run dns-aid:verify');
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
