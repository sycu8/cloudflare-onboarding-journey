import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CLOUDFLARE_STATUS_API_INCIDENTS,
  CLOUDFLARE_STATUS_API_SUMMARY,
  CLOUDFLARE_STATUS_URL,
  impactLabels,
  incidentOfficialUrl,
  incidentStatusLabels,
  matchesStatusTrack,
  pageIndicatorLabels,
  statusSnapshot,
  statusTrackLabels,
  type StatusTrackFilter,
} from '../../data/systemStatus';
import Pagination from '../ui/Pagination';

type ApiIncident = {
  id: string;
  name: string;
  status: string;
  impact: string;
  created_at: string;
  updated_at: string;
  components?: { name: string }[];
};

type ApiSummary = {
  page?: { updated_at?: string };
  status?: { indicator?: string; description?: string };
  incidents?: ApiIncident[];
  scheduled_maintenances?: {
    id: string;
    name: string;
    status: string;
    impact: string;
    scheduled_for: string;
    scheduled_until: string;
  }[];
};

const RECENT_PAGE_SIZE = 6;

function getLang(): 'vi' | 'en' {
  if (typeof document === 'undefined') return 'vi';
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
}

function t(ls: { vi: string; en: string }, lang: 'vi' | 'en') {
  return lang === 'en' ? ls.en : ls.vi;
}

function formatWhen(iso: string, lang: 'vi' | 'en') {
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function normalizeIncident(i: ApiIncident) {
  return {
    id: i.id,
    name: i.name,
    status: i.status,
    impact: i.impact,
    updatedAt: i.updated_at,
    components: i.components?.map((c) => c.name) ?? [],
    active: i.status !== 'resolved' && i.status !== 'postmortem',
  };
}

function impactBadgeClass(impact: string) {
  if (impact === 'critical') return 'badge badge-accent';
  if (impact === 'major') return 'badge badge-accent';
  if (impact === 'minor') return 'badge';
  return 'badge opacity-80';
}

function statusBannerClass(indicator?: string) {
  if (indicator === 'critical' || indicator === 'major') return 'border-[var(--cf-accent)] bg-[rgba(246,130,26,0.12)]';
  if (indicator === 'minor') return 'border-[var(--cf-border)] bg-[rgba(234,179,8,0.12)]';
  return 'border-[var(--cf-border)] bg-[rgba(34,197,94,0.08)]';
}

export default function StatusDashboard() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [track, setTrack] = useState<StatusTrackFilter>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [indicator, setIndicator] = useState(statusSnapshot.pageStatus.indicator);
  const [indicatorDesc, setIndicatorDesc] = useState(statusSnapshot.pageStatus.description);
  const [activeIncidents, setActiveIncidents] = useState(statusSnapshot.activeIncidents);
  const [recentIncidents, setRecentIncidents] = useState(statusSnapshot.recentResolved);
  const [maintenance, setMaintenance] = useState<
    { id: string; name: string; status: string; scheduled_for: string; scheduled_until: string }[]
  >([]);

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, incidentsRes] = await Promise.all([
        fetch(CLOUDFLARE_STATUS_API_SUMMARY),
        fetch(CLOUDFLARE_STATUS_API_INCIDENTS),
      ]);
      if (!summaryRes.ok || !incidentsRes.ok) throw new Error('status_api_error');

      const summary = (await summaryRes.json()) as ApiSummary;
      const incidentsPayload = (await incidentsRes.json()) as { incidents?: ApiIncident[] };

      setLive(true);
      setUpdatedAt(summary.page?.updated_at ?? new Date().toISOString());
      setIndicator(summary.status?.indicator ?? 'none');
      setIndicatorDesc(summary.status?.description ?? 'All Systems Operational');

      const allIncidents = (incidentsPayload.incidents ?? []).map(normalizeIncident);
      setActiveIncidents(allIncidents.filter((i) => i.active));
      setRecentIncidents(allIncidents.filter((i) => !i.active).slice(0, 30));

      const activeMaint =
        summary.scheduled_maintenances?.filter((m) => m.status === 'in_progress') ?? [];
      setMaintenance(activeMaint);
    } catch {
      setLive(false);
      setActiveIncidents(statusSnapshot.activeIncidents);
      setRecentIncidents(statusSnapshot.recentResolved);
      setIndicator(statusSnapshot.pageStatus.indicator);
      setIndicatorDesc(statusSnapshot.pageStatus.description);
      setMaintenance([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filterByTrack = useCallback(
    <T extends { name: string; components?: string[] }>(items: T[]) => {
      if (track === 'all') return items;
      return items.filter((i) => matchesStatusTrack(track, i));
    },
    [track],
  );

  const filteredActive = useMemo(() => filterByTrack(activeIncidents), [activeIncidents, filterByTrack]);
  const filteredRecent = useMemo(() => filterByTrack(recentIncidents), [recentIncidents, filterByTrack]);

  const totalPages = Math.max(1, Math.ceil(filteredRecent.length / RECENT_PAGE_SIZE));
  const pagedRecent = useMemo(() => {
    const start = (page - 1) * RECENT_PAGE_SIZE;
    return filteredRecent.slice(start, start + RECENT_PAGE_SIZE);
  }, [filteredRecent, page]);

  useEffect(() => {
    setPage(1);
  }, [track]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const indicatorLabel =
    pageIndicatorLabels[indicator] ??
    ({ vi: indicatorDesc, en: indicatorDesc } as { vi: string; en: string });

  return (
    <div>
      <div className={`card mb-6 border ${statusBannerClass(indicator)}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              <span className="lang-vi">Trạng thái tổng thể</span>
              <span className="lang-en">Overall status</span>
            </p>
            <p className="mt-1 text-lg font-semibold">{t(indicatorLabel, lang)}</p>
            {!live ? (
              <p className="text-muted mt-2 text-xs">
                <span className="lang-vi">Đang dùng snapshot tĩnh — không tải được API live.</span>
                <span className="lang-en">Using static snapshot — live API unavailable.</span>
              </p>
            ) : null}
            {updatedAt ? (
              <p className="text-muted mt-1 text-xs">
                <span className="lang-vi">Cập nhật: </span>
                <span className="lang-en">Updated: </span>
                {formatWhen(updatedAt, lang)}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary text-sm" disabled={loading} onClick={() => void load()}>
              <span className="lang-vi">{loading ? 'Đang tải…' : 'Làm mới'}</span>
              <span className="lang-en">{loading ? 'Loading…' : 'Refresh'}</span>
            </button>
            <a className="btn btn-primary text-sm" href={CLOUDFLARE_STATUS_URL} target="_blank" rel="noopener noreferrer">
              <span className="lang-vi">Mở status chính thức ↗</span>
              <span className="lang-en">Open official status ↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          <span className="lang-vi">Lọc theo lộ trình hub: </span>
          <span className="lang-en">Hub track filter: </span>
          <select
            className="cf-input ml-1 inline-block w-auto min-w-[180px]"
            value={track}
            onChange={(e) => setTrack(e.target.value as StatusTrackFilter)}
          >
            {(Object.keys(statusTrackLabels) as StatusTrackFilter[]).map((key) => (
              <option key={key} value={key}>
                {t(statusTrackLabels[key], lang)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold">
          <span className="lang-vi">Sự cố đang active</span>
          <span className="lang-en">Active incidents</span>
          <span className="text-muted ml-2 text-sm font-normal">({filteredActive.length})</span>
        </h2>
        {filteredActive.length === 0 ? (
          <p className="text-muted mt-3 text-sm">
            <span className="lang-vi">Không có sự cố active khớp bộ lọc.</span>
            <span className="lang-en">No active incidents match the filter.</span>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {filteredActive.map((inc) => (
              <li key={inc.id} className="card border-l-4 border-l-[var(--cf-accent)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={impactBadgeClass(inc.impact)}>
                    {t(impactLabels[inc.impact] ?? { vi: inc.impact, en: inc.impact }, lang)}
                  </span>
                  <span className="badge">
                    {t(incidentStatusLabels[inc.status] ?? { vi: inc.status, en: inc.status }, lang)}
                  </span>
                  <time className="text-muted text-xs tabular-nums">{formatWhen(inc.updatedAt, lang)}</time>
                </div>
                <h3 className="mt-2 text-base font-semibold leading-snug">
                  <a className="link" href={incidentOfficialUrl(inc.id)} target="_blank" rel="noopener noreferrer">
                    {inc.name}
                  </a>
                </h3>
                {inc.components.length > 0 ? (
                  <p className="text-muted mt-2 text-xs">
                    {inc.components.join(' · ')}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {maintenance.length > 0 ? (
        <section className="mb-8">
          <h2 className="text-lg font-semibold">
            <span className="lang-vi">Bảo trì đang diễn ra</span>
            <span className="lang-en">Active maintenance</span>
          </h2>
          <ul className="mt-4 space-y-3">
            {maintenance.map((m) => (
              <li key={m.id} className="card">
                <h3 className="text-sm font-semibold">{m.name}</h3>
                <p className="text-muted mt-1 text-xs">
                  {formatWhen(m.scheduled_for, lang)} → {formatWhen(m.scheduled_until, lang)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold">
          <span className="lang-vi">Sự cố gần đây (đã xử lý)</span>
          <span className="lang-en">Recent incidents (resolved)</span>
          <span className="text-muted ml-2 text-sm font-normal">({filteredRecent.length})</span>
        </h2>
        {filteredRecent.length === 0 ? (
          <p className="text-muted mt-3 text-sm">
            <span className="lang-vi">Không có mục nào khớp bộ lọc.</span>
            <span className="lang-en">No entries match the filter.</span>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pagedRecent.map((inc) => (
              <li key={inc.id} className="card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge opacity-80">
                    {t(impactLabels[inc.impact] ?? { vi: inc.impact, en: inc.impact }, lang)}
                  </span>
                  <span className="badge">
                    {t(incidentStatusLabels[inc.status] ?? { vi: inc.status, en: inc.status }, lang)}
                  </span>
                  <time className="text-muted text-xs tabular-nums">{formatWhen(inc.updatedAt, lang)}</time>
                </div>
                <h3 className="mt-2 text-sm font-semibold leading-snug">
                  <a className="link" href={incidentOfficialUrl(inc.id)} target="_blank" rel="noopener noreferrer">
                    {inc.name}
                  </a>
                </h3>
              </li>
            ))}
          </ul>
        )}
        <Pagination className="mt-6" page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </div>
  );
}
