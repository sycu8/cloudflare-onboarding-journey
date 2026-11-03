import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CLOUDFLARE_STATUS_URL,
  HUB_STATUS_API,
  impactLabels,
  incidentStatusLabels,
  matchesStatusTrack,
  pageIndicatorLabels,
  statusLoadError,
  statusTrackLabels,
  type StatusTrackFilter,
} from '../../data/systemStatus';
import Pagination from '../ui/Pagination';

type HubIncident = {
  id: string;
  name: string;
  status: string;
  impact: string;
  startedAt: string;
  updatedAt: string;
  components: string[];
  url: string;
  active: boolean;
};

type HubStatus = {
  ok: true;
  updatedAt: string;
  indicator: string;
  description: string;
  active: HubIncident[];
  recent: HubIncident[];
  maintenance: { id: string; name: string; status: string; url: string; scheduledFor: string; scheduledUntil: string }[];
};

const RECENT_PAGE_SIZE = 6;
const OFFICIAL_LINK = 'https://www.cloudflarestatus.com/incidents/';

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

function impactBadgeClass(impact: string) {
  if (impact === 'critical' || impact === 'major') return 'badge badge-accent';
  if (impact === 'minor') return 'badge';
  return 'badge opacity-80';
}

function statusBannerClass(indicator?: string) {
  if (indicator === 'critical' || indicator === 'major') return 'border-[var(--cf-accent)] bg-[rgba(246,130,26,0.12)]';
  if (indicator === 'minor') return 'border-[var(--cf-border)] bg-[rgba(234,179,8,0.12)]';
  return 'border-[var(--cf-border)] bg-[rgba(34,197,94,0.08)]';
}

function safeIncidentUrl(url: string): string | null {
  return url.startsWith(OFFICIAL_LINK) ? url : null;
}

export default function StatusDashboard() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [track, setTrack] = useState<StatusTrackFilter>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [indicator, setIndicator] = useState('none');
  const [indicatorDesc, setIndicatorDesc] = useState('');
  const [activeIncidents, setActiveIncidents] = useState<HubIncident[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<HubIncident[]>([]);
  const [maintenance, setMaintenance] = useState<HubStatus['maintenance']>([]);

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(HUB_STATUS_API, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error('status_api_error');
      const payload = (await response.json()) as HubStatus | { ok: false };
      if (!payload.ok) throw new Error('status_unavailable');
      const live = payload.active.every((incident) => safeIncidentUrl(incident.url))
        && payload.recent.every((incident) => safeIncidentUrl(incident.url));
      if (!live) throw new Error('bad_incident_link');
      setUpdatedAt(payload.updatedAt);
      setIndicator(payload.indicator || 'none');
      setIndicatorDesc(payload.description || '');
      setActiveIncidents(payload.active);
      setRecentIncidents(payload.recent);
      setMaintenance(payload.maintenance ?? []);
      setFailed(false);
    } catch {
      setFailed(true);
      setUpdatedAt(null);
      setIndicator('none');
      setIndicatorDesc('');
      setActiveIncidents([]);
      setRecentIncidents([]);
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

  if (failed) {
    return (
      <div className="card border border-[var(--cf-border)]">
        <p className="text-sm font-medium">
          <span className="lang-vi">{statusLoadError.vi}</span>
          <span className="lang-en">{statusLoadError.en}</span>
          <span className="lang-km">{statusLoadError.en}</span>
        </p>
        <a className="btn btn-primary mt-4 inline-flex" href={CLOUDFLARE_STATUS_URL} target="_blank" rel="noopener noreferrer">
          www.cloudflarestatus.com ↗
        </a>
      </div>
    );
  }

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
              <span className="lang-km">Overall status</span>
            </p>
            <p className="mt-1 text-lg font-semibold">
              {loading ? '…' : indicatorDesc || t(indicatorLabel, lang)}
            </p>
            {updatedAt ? (
              <p className="text-muted mt-1 text-xs">
                <span className="lang-vi">Cập nhật lần cuối: </span>
                <span className="lang-en">Last updated </span>
                <span className="lang-km">Last updated </span>
                {formatWhen(updatedAt, lang)}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary text-sm" disabled={loading} onClick={() => void load()}>
              <span className="lang-vi">{loading ? 'Đang tải…' : 'Làm mới'}</span>
              <span className="lang-en">{loading ? 'Loading…' : 'Refresh'}</span>
              <span className="lang-km">{loading ? 'Loading…' : 'Refresh'}</span>
            </button>
            <a className="btn btn-primary text-sm" href={CLOUDFLARE_STATUS_URL} target="_blank" rel="noopener noreferrer">
              www.cloudflarestatus.com ↗
            </a>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted text-sm">
          <span className="lang-vi">Đang tải trạng thái chính thức…</span>
          <span className="lang-en">Loading official status…</span>
          <span className="lang-km">Loading official status…</span>
        </p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="text-sm font-medium">
              <span className="lang-vi">Lọc theo lộ trình hub: </span>
              <span className="lang-en">Hub track filter: </span>
              <span className="lang-km">Hub track filter: </span>
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
              <span className="lang-vi">Sự cố đang mở</span>
              <span className="lang-en">Active incidents</span>
              <span className="lang-km">Active incidents</span>
              <span className="text-muted ml-2 text-sm font-normal">({filteredActive.length})</span>
            </h2>
            {filteredActive.length === 0 ? (
              <p className="text-muted mt-3 text-sm">
                <span className="lang-vi">Không có sự cố đang mở trên trang trạng thái.</span>
                <span className="lang-en">No open incidents on the status page.</span>
                <span className="lang-km">No open incidents on the status page.</span>
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {filteredActive.map((inc) => (
                  <IncidentCard key={inc.id} inc={inc} lang={lang} />
                ))}
              </ul>
            )}
          </section>

          {maintenance.length > 0 ? (
            <section className="mb-8">
              <h2 className="text-lg font-semibold">
                <span className="lang-vi">Bảo trì đang diễn ra</span>
                <span className="lang-en">Active maintenance</span>
                <span className="lang-km">Active maintenance</span>
              </h2>
              <ul className="mt-4 space-y-3">
                {maintenance.map((item) => (
                  <li key={item.id} className="card">
                    <h3 className="text-sm font-semibold">
                      <a className="link" href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
                    </h3>
                    <p className="text-muted mt-1 text-xs">
                      {formatWhen(item.scheduledFor, lang)} → {formatWhen(item.scheduledUntil, lang)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="text-lg font-semibold">
              <span className="lang-vi">Sự cố gần đây</span>
              <span className="lang-en">Recent incidents</span>
              <span className="lang-km">Recent incidents</span>
              <span className="text-muted ml-2 text-sm font-normal">({filteredRecent.length})</span>
            </h2>
            {filteredRecent.length === 0 ? (
              <p className="text-muted mt-3 text-sm">
                <span className="lang-vi">Không có mục lịch sử khớp bộ lọc.</span>
                <span className="lang-en">No history entries match the filter.</span>
                <span className="lang-km">No history entries match the filter.</span>
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {pagedRecent.map((inc) => (
                  <IncidentCard key={inc.id} inc={inc} lang={lang} />
                ))}
              </ul>
            )}
            <Pagination className="mt-6" page={page} totalPages={totalPages} onPageChange={setPage} />
          </section>
        </>
      )}
    </div>
  );
}

function IncidentCard({ inc, lang }: { inc: HubIncident; lang: 'vi' | 'en' }) {
  const href = safeIncidentUrl(inc.url);
  if (!href) return null;
  return (
    <li className="card">
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
        <a className="link" href={href} target="_blank" rel="noopener noreferrer">{inc.name}</a>
      </h3>
      <p className="text-muted mt-1 text-xs">
        <span className="lang-vi">Bắt đầu: </span>
        <span className="lang-en">Started: </span>
        <span className="lang-km">Started: </span>
        {formatWhen(inc.startedAt, lang)}
      </p>
      {inc.components.length > 0 ? (
        <p className="text-muted mt-2 text-xs">{inc.components.join(' · ')}</p>
      ) : null}
    </li>
  );
}
