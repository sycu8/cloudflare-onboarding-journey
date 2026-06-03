/**
 * Verify DNS-AID records (matches isitagentready.com discoverability.dnsAid queries).
 * Usage: node scripts/verify-dns-aid.mjs [https://onboarding.orangecloud.vn]
 */
const ORIGIN = (process.argv[2] || process.env.PUBLIC_SITE_URL || 'https://onboarding.orangecloud.vn').replace(/\/$/, '');
const HOST = new URL(ORIGIN).hostname;
const DOH = process.env.DOH_RESOLVER || 'https://cloudflare-dns.com/dns-query';

const WELL_KNOWN = ['_index', '_a2a', '_mcp'];

const query = async (name, type) => {
  const url = `${DOH}?name=${encodeURIComponent(name)}&type=${type}&do=1`;
  const res = await fetch(url, { headers: { Accept: 'application/dns-json' } });
  if (!res.ok) throw new Error(`DoH ${res.status} for ${name} ${type}`);
  return res.json();
};

const parseHttpsSvcb = (data) => {
  if (!data) return null;
  const m = String(data).match(/^(\d+)\s+(\S+)\s*(.*)$/);
  if (!m) return { raw: data };
  const [, priority, target, params] = m;
  return { priority: Number(priority), target, params: params.trim() };
};

let dnssecAd = false;
let serviceCount = 0;
let aliasCount = 0;
let txtIndexCount = 0;
const found = [];

for (const label of WELL_KNOWN) {
  const qname = `${label}._agents.${HOST}`;
  for (const type of ['SVCB', 'HTTPS']) {
    const json = await query(qname, type);
    if (json.AD) dnssecAd = true;
    for (const ans of json.Answer || []) {
      const parsed = parseHttpsSvcb(ans.data);
      if (!parsed) continue;
      found.push({ qname, rrType: type, ...parsed });
      if (parsed.target === '.' || parsed.target === '') serviceCount++;
      else aliasCount++;
    }
  }
}

const indexTxt = await query(`_index._agents.${HOST}`, 'TXT');
if (indexTxt.AD) dnssecAd = true;
for (const ans of indexTxt.Answer || []) {
  txtIndexCount++;
  found.push({ qname: `_index._agents.${HOST}`, rrType: 'TXT', data: ans.data });
}

const ok =
  (serviceCount > 0 || aliasCount > 0) &&
  (aliasCount > 0 || txtIndexCount > 0);

console.log(`Host: ${HOST}`);
console.log(`DoH:  ${DOH}`);
console.log(`DNSSEC AD (authenticated data): ${dnssecAd ? 'yes' : 'no'}`);
console.log(`Alias SVCB/HTTPS: ${aliasCount}, ServiceMode: ${serviceCount}, TXT _index: ${txtIndexCount}`);
if (found.length) {
  console.log('Records:');
  for (const r of found) console.log(' ', JSON.stringify(r));
} else {
  console.log('Records: (none)');
}

if (!ok) {
  console.error('\nFAIL: DNS-AID well-known entrypoint records not found.');
  console.error('Create records in docs/DNS-AID.md or run: npm run dns-aid:setup');
  process.exit(1);
}

if (!dnssecAd) {
  console.warn('\nWARN: DoH response did not set AD; enable DNSSEC on the zone for validating resolvers.');
}

console.log('\nPASS: DNS-AID records present.');
process.exit(dnssecAd ? 0 : 2);
