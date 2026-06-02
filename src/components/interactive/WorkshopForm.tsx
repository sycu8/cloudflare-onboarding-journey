import { useEffect, useState } from 'react';

type Interest = 'application-services' | 'developer-platform' | 'cloudflare-one' | 'not-sure';

type Props = {
  eventId?: string;
  requireEvent?: boolean;
};

export default function WorkshopForm({ eventId = '', requireEvent = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [interest, setInterest] = useState<Interest>('not-sure');
  const [question, setQuestion] = useState('');

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => r.json())
      .then((d) => {
        if (d?.workshopEnabled === false) setEnabled(false);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const lang = document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
    if (requireEvent && !eventId) {
      setError(
        lang === 'en' ? 'Please select a workshop event above.' : 'Vui lòng chọn một sự kiện workshop ở trên.',
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/workshop-signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-cfhub-lang': lang },
        body: JSON.stringify({
          name,
          email,
          company,
          role,
          primaryInterest: interest,
          ...(eventId ? { eventId } : {}),
          question,
          language: lang,
          sourcePath: window.location.pathname,
          turnstileToken: 'dev-bypass',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'submit_failed');
      }
      setSuccess(true);
      window.location.href = '/thank-you';
    } catch {
      setError(lang === 'en' ? 'We could not submit your information right now. Please try again.' : 'Không thể gửi thông tin lúc này. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  if (!enabled) {
    return (
      <div className="card">
        <span className="lang-vi">Đăng ký workshop tạm đóng. Vui lòng quay lại sau.</span>
        <span className="lang-en">Workshop registration is temporarily closed. Please check back later.</span>
      </div>
    );
  }

  if (success) return null;

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      {eventId ? (
        <p className="rounded-xl border border-[var(--cf-border)] bg-[var(--cf-bg-elevated)]/50 px-3 py-2 text-xs">
          <span className="lang-vi">Đăng ký cho sự kiện: </span>
          <span className="lang-en">Registering for event: </span>
          <span className="font-mono">{eventId}</span>
        </p>
      ) : null}
      <label className="block text-sm">
        <span className="lang-vi">Họ và tên</span>
        <span className="lang-en">Name</span>
        <input className="cf-input mt-1" required value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm">
        Email
        <input className="cf-input mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="lang-vi">Công ty</span>
        <span className="lang-en">Company</span>
        <input className="cf-input mt-1" value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="lang-vi">Vai trò</span>
        <span className="lang-en">Role</span>
        <input className="cf-input mt-1" value={role} onChange={(e) => setRole(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="lang-vi">Mối quan tâm chính</span>
        <span className="lang-en">Primary interest</span>
        <select className="cf-input mt-1" value={interest} onChange={(e) => setInterest(e.target.value as Interest)}>
          <option value="application-services">Application Services</option>
          <option value="developer-platform">Developer Platform</option>
          <option value="cloudflare-one">Cloudflare One</option>
          <option value="not-sure">Not sure</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="lang-vi">Câu hỏi của bạn</span>
        <span className="lang-en">Your question</span>
        <textarea className="cf-input mt-1 min-h-[100px]" value={question} onChange={(e) => setQuestion(e.target.value)} />
      </label>
      <p className="text-muted text-xs">
        <span className="lang-vi">Chúng tôi chỉ thu thập thông tin cần thiết cho workshop. Xem </span>
        <span className="lang-en">We only collect information needed for the workshop. See </span>
        <a className="link" href="/privacy">Privacy</a>.
      </p>
      {error ? <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">{error}</div> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? '…' : <><span className="lang-vi">Gửi đăng ký</span><span className="lang-en">Submit</span></>}
      </button>
      <p className="text-muted text-xs">
        <span className="lang-vi">Production: bật Turnstile + D1. Dev: token bypass nếu chưa cấu hình Turnstile.</span>
        <span className="lang-en">Production: enable Turnstile + D1. Dev: bypass token if Turnstile is not configured.</span>
      </p>
    </form>
  );
}
