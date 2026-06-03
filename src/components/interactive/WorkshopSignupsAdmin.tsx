import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '../../lib/adminApi';
import type { WorkshopSignup } from '../../types/workshop';
import { usePageLang } from '../../lib/usePageLang';

type Props = {
  active: boolean;
};

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

function csvCell(value: string | null | undefined) {
  const s = value ?? '';
  return `"${s.replace(/"/g, '""')}"`;
}

function signupsToCsv(rows: WorkshopSignup[], lang: 'vi' | 'en') {
  const headers =
    lang === 'en'
      ? ['ID', 'Name', 'Email', 'Company', 'Job title', 'Interest', 'Question', 'Language', 'Event', 'Registered at']
      : ['ID', 'Họ tên', 'Email', 'Công ty', 'Vị trí', 'Mối quan tâm', 'Câu hỏi', 'Ngôn ngữ', 'Sự kiện', 'Thời gian'];
  const lines = [headers.map(csvCell).join(',')];
  for (const row of rows) {
    const eventLabel = row.eventTitle ? (lang === 'en' ? row.eventTitle.en : row.eventTitle.vi) || row.eventId : '';
    lines.push(
      [
        row.id,
        row.name,
        row.email,
        row.company,
        row.jobTitle,
        row.primaryInterest,
        row.question,
        row.language,
        eventLabel || row.eventId,
        row.createdAt,
      ]
        .map(csvCell)
        .join(','),
    );
  }
  return `\uFEFF${lines.join('\r\n')}`;
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function WorkshopSignupsAdmin({ active }: Props) {
  const lang = usePageLang();
  const [signups, setSignups] = useState<WorkshopSignup[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSignups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/signups?limit=500', {
        headers: { 'x-cfhub-lang': lang },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || 'load_failed');
      }
      setSignups(data.signups ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError(lang === 'en' ? 'Could not load registrations.' : 'Không tải được danh sách đăng ký.');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (active) void loadSignups();
  }, [active, loadSignups]);

  function exportCsv() {
    if (!signups.length) return;
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`workshop-signups-${stamp}.csv`, signupsToCsv(signups, lang));
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            <span className="lang-vi">Danh sách đăng ký</span>
            <span className="lang-en">Registrations</span>
          </h3>
          <p className="text-muted text-sm">
            {total > 0 ? (
              <>
                <span className="lang-vi">{total} bản ghi</span>
                <span className="lang-en">{total} records</span>
                {signups.length < total ? (
                  <>
                    {' '}
                    <span className="lang-vi">(hiển thị {signups.length} mới nhất)</span>
                    <span className="lang-en">(showing latest {signups.length})</span>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <span className="lang-vi">Chưa có đăng ký</span>
                <span className="lang-en">No registrations yet</span>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary text-sm" disabled={loading} onClick={() => void loadSignups()}>
            <span className="lang-vi">{loading ? 'Đang tải…' : 'Làm mới'}</span>
            <span className="lang-en">{loading ? 'Loading…' : 'Refresh'}</span>
          </button>
          <button type="button" className="btn btn-primary text-sm" disabled={!signups.length} onClick={exportCsv}>
            <span className="lang-vi">Xuất CSV</span>
            <span className="lang-en">Export CSV</span>
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {signups.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-muted border-b border-[var(--cf-border)]">
                <th className="py-2 pr-3">
                  <span className="lang-vi">Thời gian</span>
                  <span className="lang-en">When</span>
                </th>
                <th className="py-2 pr-3">
                  <span className="lang-vi">Họ tên</span>
                  <span className="lang-en">Name</span>
                </th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">
                  <span className="lang-vi">Công ty</span>
                  <span className="lang-en">Company</span>
                </th>
                <th className="py-2 pr-3">
                  <span className="lang-vi">Vị trí</span>
                  <span className="lang-en">Job title</span>
                </th>
                <th className="py-2 pr-3">
                  <span className="lang-vi">Mối quan tâm</span>
                  <span className="lang-en">Interest</span>
                </th>
                <th className="py-2">
                  <span className="lang-vi">Sự kiện</span>
                  <span className="lang-en">Event</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {signups.map((row) => (
                <tr key={row.id} className="border-b border-[var(--cf-border)]/50 align-top">
                  <td className="py-2 pr-3 whitespace-nowrap text-xs">{formatWhen(row.createdAt, lang)}</td>
                  <td className="py-2 pr-3">{row.name}</td>
                  <td className="py-2 pr-3">
                    <a className="link break-all" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  </td>
                  <td className="py-2 pr-3">{row.company || '—'}</td>
                  <td className="py-2 pr-3">{row.jobTitle || '—'}</td>
                  <td className="py-2 pr-3 text-xs">{row.primaryInterest}</td>
                  <td className="py-2 text-xs">
                    {row.eventTitle ? (lang === 'en' ? row.eventTitle.en : row.eventTitle.vi) || row.eventId : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading && !error ? (
        <div className="card text-muted text-sm">
          <span className="lang-vi">Chưa có ai đăng ký qua form hub.</span>
          <span className="lang-en">No hub form registrations yet.</span>
        </div>
      ) : null}
    </section>
  );
}
