/**
 * Incident links must point at the official status host.
 */
import { incidentOfficialUrl } from '../src/data/systemStatus.ts';

const url = incidentOfficialUrl('6c4ak19xodyt');
if (!url.startsWith('https://www.cloudflarestatus.com/incidents/')) {
  console.error(url);
  process.exit(1);
}

let threw = false;
try {
  incidentOfficialUrl('../etc/passwd');
} catch {
  threw = true;
}
if (!threw) {
  console.error('invalid incident id was accepted');
  process.exit(1);
}

console.log('✓ incident links use www.cloudflarestatus.com/incidents/');
