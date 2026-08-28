import { Fragment, useEffect, useMemo, useState } from 'react';
import type { SuccessPackageCategory, SuccessPackageFeature } from '../../data/enterpriseSuccessPackages';

type ViewMode = 'standard-vs-premium' | 'all' | 'standard-only' | 'premium-only';

function getLang(): 'vi' | 'en' {
  if (typeof document === 'undefined') return 'vi';
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
}

function label(ls: { vi: string; en: string }, lang: 'vi' | 'en') {
  return lang === 'en' ? ls.en : ls.vi;
}

function differsStandardPremium(f: SuccessPackageFeature) {
  return (
    f.standard !== f.premiumT1 ||
    f.standard !== f.premiumT2 ||
    f.standard !== f.premiumT3
  );
}

function cellDisplay(value: string) {
  if (value === 'yes') return { symbol: '✓', className: 'text-emerald-600 dark:text-emerald-400' };
  if (value === 'no') return { symbol: '—', className: 'text-muted opacity-60' };
  return { symbol: value, className: 'text-xs font-medium' };
}

export default function EnterpriseSuccessPackagesTable(props: { categories: SuccessPackageCategory[] }) {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [view, setView] = useState<ViewMode>('standard-vs-premium');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  const ui = useMemo(
    () =>
      lang === 'en'
        ? {
            search: 'Search features…',
            all: 'All categories',
            viewCompare: 'Standard vs Premium',
            viewAll: 'All rows',
            viewStd: 'Standard highlights',
            viewPrem: 'Premium upgrades',
            feature: 'Feature',
            standard: 'Standard',
            premiumT1: 'Premium T1',
            premiumT2: 'Premium T2',
            premiumT3: 'Premium T3',
            note: 'Notes',
            rows: 'rows',
          }
        : {
            search: 'Tìm tính năng…',
            all: 'Tất cả nhóm',
            viewCompare: 'Standard vs Premium',
            viewAll: 'Tất cả dòng',
            viewStd: 'Điểm mạnh Standard',
            viewPrem: 'Nâng cấp Premium',
            feature: 'Tính năng',
            standard: 'Standard',
            premiumT1: 'Premium T1',
            premiumT2: 'Premium T2',
            premiumT3: 'Premium T3',
            note: 'Ghi chú',
            rows: 'dòng',
          },
    [lang],
  );

  const flat = useMemo(() => {
    const rows: { category: SuccessPackageCategory; feature: SuccessPackageFeature }[] = [];
    for (const cat of props.categories) {
      for (const f of cat.features) rows.push({ category: cat, feature: f });
    }
    return rows;
  }, [props.categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flat.filter(({ category, feature }) => {
      if (categoryId !== 'all' && category.id !== categoryId) return false;
      if (view === 'standard-vs-premium' && !differsStandardPremium(feature)) return false;
      if (view === 'standard-only' && feature.standard !== 'yes') return false;
      if (view === 'premium-only' && feature.standard === feature.premiumT1) return false;
      if (!q) return true;
      const name = `${feature.name.vi} ${feature.name.en}`.toLowerCase();
      return name.includes(q);
    });
  }, [flat, categoryId, view, query]);

  const tiers = ['standard', 'premiumT1', 'premiumT2', 'premiumT3'] as const;
  const tierLabels = {
    standard: ui.standard,
    premiumT1: ui.premiumT1,
    premiumT2: ui.premiumT2,
    premiumT3: ui.premiumT3,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          className="cf-input max-w-md flex-1 text-sm"
          placeholder={ui.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="cf-input text-sm"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-label={ui.all}
        >
          <option value="all">{ui.all}</option>
          {props.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {label(c.title, lang)}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1">
          {(
            [
              ['standard-vs-premium', ui.viewCompare],
              ['all', ui.viewAll],
              ['standard-only', ui.viewStd],
              ['premium-only', ui.viewPrem],
            ] as const
          ).map(([id, text]) => (
            <button
              key={id}
              type="button"
              className={`btn text-xs ${view === id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView(id)}
            >
              {text}
            </button>
          ))}
        </div>
        <span className="text-muted text-xs">
          {filtered.length} {ui.rows}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--cf-border)' }}>
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide" style={{ borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}>
              <th className="px-3 py-3 font-semibold">{ui.feature}</th>
              {tiers.map((tier) => (
                <th
                  key={tier}
                  className={`px-2 py-3 text-center font-semibold ${tier === 'standard' ? 'bg-[rgba(255,140,56,0.08)]' : 'bg-[rgba(255,140,56,0.12)]'}`}
                >
                  {tierLabels[tier]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ category, feature }) => {
              const rowKey = `${category.id}:${feature.id}`;
              const expanded = expandedId === rowKey;
              const hasNote = Boolean(feature.note);
              return (
                <Fragment key={rowKey}>
                  <tr className="border-b align-top" style={{ borderColor: 'var(--cf-border)' }}>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        className={`text-left font-medium ${hasNote ? 'link' : ''}`}
                        disabled={!hasNote}
                        onClick={() => hasNote && setExpandedId(expanded ? null : rowKey)}
                      >
                        {label(feature.name, lang)}
                      </button>
                      <div className="text-muted text-[0.65rem]">{label(category.title, lang)}</div>
                    </td>
                    {tiers.map((tier) => {
                      const val = feature[tier];
                      const { symbol, className } = cellDisplay(val);
                      const highlight = tier === 'standard' || tier.startsWith('premium');
                      return (
                        <td
                          key={tier}
                          className={`px-2 py-2.5 text-center ${highlight ? (tier === 'standard' ? 'bg-[rgba(255,140,56,0.03)]' : 'bg-[rgba(255,140,56,0.05)]') : ''}`}
                        >
                          <span className={className}>{symbol}</span>
                        </td>
                      );
                    })}
                  </tr>
                  {expanded && feature.note ? (
                    <tr key={`${rowKey}-note`} className="border-b" style={{ borderColor: 'var(--cf-border)' }}>
                      <td colSpan={5} className="text-muted px-3 py-2 text-xs leading-relaxed">
                        <span className="font-medium">{ui.note}: </span>
                        {label(feature.note, lang)}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
