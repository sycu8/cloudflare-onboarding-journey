import { useEffect, useMemo, useState } from 'react';
import type { LocalizedString } from '../../i18n/types';
import type {
  FlowNodeRole,
  FlowOutcome,
  ProductFlowDef,
  ProductFlowNode,
} from '../../data/productFlows';

type Lang = 'vi' | 'en';

function getLang(): Lang {
  if (typeof document === 'undefined') return 'vi';
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
}

function t(ls: LocalizedString, lang: Lang) {
  return lang === 'en' ? ls.en : ls.vi;
}

const SVG_W = 720;
const SVG_H = 220;
const ROW_Y = 96;
const DROP_Y = 176;
const PAD_X = 56;
const SCENE_MS = 4200;

type Pt = { x: number; y: number };

function roleFill(role: FlowNodeRole): string {
  switch (role) {
    case 'client':
      return 'var(--cf-bg-elevated)';
    case 'edge':
      return 'color-mix(in srgb, var(--cf-accent) 12%, var(--cf-bg-elevated))';
    case 'product':
      return 'color-mix(in srgb, var(--cf-accent) 22%, var(--cf-bg-elevated))';
    case 'origin':
      return 'var(--cf-bg-elevated)';
    case 'storage':
      return 'color-mix(in srgb, var(--cf-glow-blue) 55%, var(--cf-bg-elevated))';
    case 'drop':
      return 'color-mix(in srgb, #ef4444 14%, var(--cf-bg-elevated))';
  }
}

function roleStroke(role: FlowNodeRole): string {
  if (role === 'drop') return '#ef4444';
  if (role === 'product') return 'var(--cf-accent)';
  return 'var(--cf-border)';
}

function outcomeColor(outcome: FlowOutcome): string {
  switch (outcome) {
    case 'block':
      return '#ef4444';
    case 'hit':
      return '#16a34a';
    case 'miss':
      return '#2563eb';
    case 'call':
      return 'var(--cf-accent)';
    case 'allow':
    default:
      return 'var(--cf-accent)';
  }
}

function outcomeBadge(outcome: FlowOutcome, lang: Lang): string {
  const map: Record<FlowOutcome, LocalizedString> = {
    allow: { vi: 'Cho phép', en: 'Allow' },
    block: { vi: 'Chặn', en: 'Block' },
    hit: { vi: 'HIT', en: 'HIT' },
    miss: { vi: 'MISS', en: 'MISS' },
    call: { vi: 'Call', en: 'Call' },
  };
  return t(map[outcome], lang);
}

function layoutNodes(nodes: ProductFlowNode[], hopIds: string[]): Map<string, Pt> {
  const map = new Map<string, Pt>();
  const dropIds = new Set(nodes.filter((n) => n.role === 'drop').map((n) => n.id));

  const row: string[] = [];
  const seen = new Set<string>();
  for (const id of hopIds) {
    if (dropIds.has(id) || seen.has(id)) continue;
    seen.add(id);
    row.push(id);
  }
  for (const n of nodes) {
    if (dropIds.has(n.id) || seen.has(n.id)) continue;
    seen.add(n.id);
    row.push(n.id);
  }

  const count = Math.max(row.length, 1);
  row.forEach((id, i) => {
    const x = PAD_X + (i * (SVG_W - PAD_X * 2)) / Math.max(count - 1, 1);
    map.set(id, { x, y: ROW_Y });
  });

  for (const id of dropIds) {
    const hopIdx = hopIds.lastIndexOf(id);
    let anchor = row[Math.floor(row.length / 2)] ?? row[0];
    if (hopIdx > 0) {
      for (let i = hopIdx - 1; i >= 0; i--) {
        if (!dropIds.has(hopIds[i]!)) {
          anchor = hopIds[i]!;
          break;
        }
      }
    }
    const ap = map.get(anchor!) ?? { x: SVG_W / 2, y: ROW_Y };
    map.set(id, { x: ap.x, y: DROP_Y });
  }

  return map;
}

function polylinePath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

function pathLength(pts: Pt[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y);
  }
  return len;
}

export default function ProductFlowAnimation(props: { flow: ProductFlowDef }) {
  const { flow } = props;
  const [lang, setLang] = useState<Lang>('vi');
  const [sceneIdx, setSceneIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [packetOn, setPacketOn] = useState(true);

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (flow.scenes.length < 2 || reducedMotion) return;
    const id = window.setInterval(() => {
      setPacketOn(false);
      window.setTimeout(() => {
        setSceneIdx((i) => (i + 1) % flow.scenes.length);
        setPacketOn(true);
      }, 80);
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, [flow.scenes.length, reducedMotion]);

  const scene = flow.scenes[sceneIdx] ?? flow.scenes[0]!;
  const positions = useMemo(
    () => layoutNodes(flow.nodes, scene.hops),
    [flow.nodes, scene.hops],
  );

  const hopPts = scene.hops
    .map((id) => positions.get(id))
    .filter((p): p is Pt => !!p);

  const d = polylinePath(hopPts);
  const len = pathLength(hopPts);
  const dur = Math.max(1.6, Math.min(3.6, len / 180));
  const color = outcomeColor(scene.outcome);

  const activeEdges: [Pt, Pt][] = [];
  for (let i = 1; i < hopPts.length; i++) {
    activeEdges.push([hopPts[i - 1]!, hopPts[i]!]);
  }

  const staticEdges: [string, string][] = [];
  const edgeKey = new Set<string>();
  for (const sc of flow.scenes) {
    for (let i = 1; i < sc.hops.length; i++) {
      const a = sc.hops[i - 1]!;
      const b = sc.hops[i]!;
      const key = `${a}→${b}`;
      if (edgeKey.has(key)) continue;
      edgeKey.add(key);
      staticEdges.push([a, b]);
    }
  }

  const ui =
    lang === 'en'
      ? {
          how: 'How it moves',
          pause: 'Scenes pause when reduced motion is on.',
          scene: 'Scene',
        }
      : {
          how: 'Cách traffic / call di chuyển',
          pause: 'Tắt chuyển cảnh khi hệ thống bật giảm chuyển động.',
          scene: 'Cảnh',
        };

  return (
    <section className="card overflow-hidden p-0" aria-label={t(flow.title, lang)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--cf-border)] px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--cf-accent)]">{ui.how}</p>
          <h2 className="text-lg font-semibold leading-snug">{t(flow.title, lang)}</h2>
        </div>
        <span
          className="rounded-md px-2 py-1 text-xs font-semibold"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 16%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
          }}
        >
          {outcomeBadge(scene.outcome, lang)}
        </span>
      </div>

      <div className="bg-[var(--cf-bg-elevated)] px-2 pt-3 sm:px-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="mx-auto h-auto w-full max-w-3xl"
          role="img"
          aria-label={t(scene.caption, lang)}
        >
          <defs>
            <marker
              id={`arrow-${flow.slug}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cf-text-muted)" opacity="0.55" />
            </marker>
          </defs>

          {staticEdges.map(([a, b]) => {
            const pa = positions.get(a);
            const pb = positions.get(b);
            if (!pa || !pb) return null;
            const active = activeEdges.some(
              ([p1, p2]) =>
                Math.abs(p1.x - pa.x) < 0.1 &&
                Math.abs(p1.y - pa.y) < 0.1 &&
                Math.abs(p2.x - pb.x) < 0.1 &&
                Math.abs(p2.y - pb.y) < 0.1,
            );
            return (
              <line
                key={`${a}-${b}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={active ? color : 'var(--cf-border)'}
                strokeWidth={active ? 2.5 : 1.5}
                strokeDasharray={active ? undefined : '4 4'}
                opacity={active ? 0.9 : 0.55}
                markerEnd={`url(#arrow-${flow.slug})`}
              />
            );
          })}

          {flow.nodes.map((node) => {
            const p = positions.get(node.id);
            if (!p) return null;
            const isDrop = node.role === 'drop';
            const w = isDrop ? 72 : 108;
            const h = 36;
            return (
              <g key={node.id} transform={`translate(${p.x}, ${p.y})`}>
                <rect
                  x={-w / 2}
                  y={-h / 2}
                  width={w}
                  height={h}
                  rx={10}
                  fill={roleFill(node.role)}
                  stroke={roleStroke(node.role)}
                  strokeWidth={node.role === 'product' ? 2 : 1.25}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--cf-text)"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {t(node.label, lang)}
                </text>
              </g>
            );
          })}

          {d && packetOn && !reducedMotion ? (
            <circle r={6} fill={color} opacity={0.95}>
              <animateMotion path={d} dur={`${dur}s`} repeatCount="indefinite" rotate="auto" />
            </circle>
          ) : null}

          {d && reducedMotion ? (
            <circle
              r={6}
              fill={color}
              cx={hopPts[hopPts.length - 1]?.x ?? 0}
              cy={hopPts[hopPts.length - 1]?.y ?? 0}
            />
          ) : null}
        </svg>
      </div>

      <div className="space-y-3 px-4 py-4">
        <p className="text-sm leading-relaxed text-[var(--cf-text)]">{t(scene.caption, lang)}</p>

        {flow.scenes.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">{ui.scene}:</span>
            {flow.scenes.map((sc, i) => (
              <button
                key={sc.id}
                type="button"
                className="rounded-md px-2.5 py-1 text-xs font-medium transition"
                style={{
                  border: `1px solid ${i === sceneIdx ? color : 'var(--cf-border)'}`,
                  background:
                    i === sceneIdx ? `color-mix(in srgb, ${color} 14%, transparent)` : 'transparent',
                  color: 'var(--cf-text)',
                }}
                aria-pressed={i === sceneIdx}
                onClick={() => {
                  setPacketOn(false);
                  setSceneIdx(i);
                  window.setTimeout(() => setPacketOn(true), 40);
                }}
              >
                {outcomeBadge(sc.outcome, lang)}
              </button>
            ))}
          </div>
        ) : null}

        {reducedMotion ? <p className="text-muted text-xs">{ui.pause}</p> : null}
      </div>
    </section>
  );
}
