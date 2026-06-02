/**
 * Regenerate src/data/cloudflarePlans.data.json from the comparison spreadsheet.
 *
 * Usage:
 *   node scripts/generate-plans-from-xlsx.mjs "C:\path\to\2025 Cloudflare Enterprise vs Business vs Pro vs Free.xlsx"
 *
 * Requires: npm install openpyxl (Python) — run the Python block below, or use openpyxl via pip.
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const xlsxPath = process.argv[2];
if (!xlsxPath) {
  console.error('Usage: node scripts/generate-plans-from-xlsx.mjs <path-to-xlsx>');
  process.exit(1);
}

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'cloudflarePlans.data.json');

const py = `
import openpyxl, json, re, sys
wb = openpyxl.load_workbook(sys.argv[1], data_only=True)
ws = wb['Full Comparison']
SECTION_HEADERS = {'Performance','Security','Reliability','Platform','Network services','Workers','Cloudflare One','Developer Platform','Support','Other','Feature Breakdown'}
CAT_VI = {'Performance': {'vi': 'Hiệu năng & CDN', 'en': 'Performance & CDN'}, 'Security': {'vi': 'Bảo mật', 'en': 'Security'}, 'Reliability': {'vi': 'Độ tin cậy', 'en': 'Reliability'}, 'Support': {'vi': 'Hỗ trợ', 'en': 'Support'}}
def norm(v):
    return '' if v is None else str(v).strip()
def cell(v):
    s = norm(v)
    if s in ('\\u2713','Yes','YES'): return 'yes'
    if s in ('X','x'): return 'no'
    return s
categories = []
current = None
for row in ws.iter_rows(min_row=1, max_row=1021, values_only=True):
    name = norm(row[0])
    if not name: continue
    if name in SECTION_HEADERS:
        if name != 'Feature Breakdown':
            cid = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
            current = {'id': cid, 'title': CAT_VI.get(name, {'vi': name, 'en': name}), 'features': []}
            categories.append(current)
        continue
    if current is None: continue
    expl = norm(row[5]) if len(row) > 5 else ''
    fid = re.sub(r'[^a-z0-9]+', '-', name.lower())[:70].strip('-') or 'feature'
    f = {'id': fid, 'name': {'vi': name, 'en': name}, 'free': cell(row[1]), 'pro': cell(row[2]), 'business': cell(row[3]), 'enterprise': cell(row[4])}
    if expl: f['note'] = {'vi': expl[:400], 'en': expl[:400]}
    current['features'].append(f)
highlights = []
for c in categories:
    for f in c['features']:
        if f['business'] != f['enterprise']:
            highlights.append({**f, 'categoryId': c['id']})
print(json.dumps({'categories': categories, 'highlights': highlights}, ensure_ascii=False))
`;

const json = execSync(`python -c ${JSON.stringify(py)} ${JSON.stringify(xlsxPath)}`, {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});

writeFileSync(outPath, JSON.stringify(JSON.parse(json), null, 2), 'utf8');
console.log('Wrote', outPath);
