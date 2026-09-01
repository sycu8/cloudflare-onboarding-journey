/** Khmer overlay for Developer Labs scan-layer + catalog copy. Missing keys fall back to English. */
import labKmJson from './developerLabs.km.json';

const LAB_KM: Record<string, string> = labKmJson as Record<string, string>;

const STEP_PREFIX = /^Step (\d+):\s*/i;

export function tLabKm(en: string): string {
  if (!en) return en;
  if (LAB_KM[en]) return LAB_KM[en];
  const m = en.match(STEP_PREFIX);
  if (m) {
    const rest = en.slice(m[0].length);
    return `ជំហាន ${m[1]}: ${LAB_KM[rest] ?? rest}`;
  }
  return en;
}
