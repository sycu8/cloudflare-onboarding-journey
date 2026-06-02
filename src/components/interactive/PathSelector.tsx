import { useEffect, useMemo, useState } from 'react';
import { getStoredLanguage } from '../../i18n/storage';

const KEY = 'cfhub_selected_path';

type Option = {
  id: string;
  label: { vi: string; en: string };
  href: string;
};

const OPTIONS: Option[] = [
  {
    id: 'faster-safer-site',
    label: {
      vi: 'Website/app của tôi cần nhanh hơn hoặc an toàn hơn',
      en: 'My website/app needs to be faster or safer',
    },
    href: '/tracks/application-services',
  },
  {
    id: 'secure-api',
    label: { vi: 'API của tôi cần được bảo vệ', en: 'My API needs protection' },
    href: '/use-cases/secure-api',
  },
  {
    id: 'build-app',
    label: { vi: 'Tôi muốn build và deploy app', en: 'I want to build and deploy an app' },
    href: '/tracks/developer-platform',
  },
  {
    id: 'replace-vpn',
    label: { vi: 'Tôi muốn thay thế VPN', en: 'I want to replace VPN' },
    href: '/use-cases/replace-vpn',
  },
  {
    id: 'secure-remote-users',
    label: { vi: 'Tôi muốn bảo vệ remote users', en: 'I want to secure remote users' },
    href: '/use-cases/secure-remote-users',
  },
  {
    id: 'not-sure',
    label: { vi: 'Tôi chưa chắc nên bắt đầu từ đâu', en: 'I am not sure where to start' },
    href: '/checklists/beginner-cloudflare-checklist',
  },
];

export default function PathSelector() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    setLang(getStoredLanguage());
  }, []);

  const ui = useMemo(() => {
    return lang === 'en'
      ? {
          title: 'Pick your starting point',
          hint: 'Choose one. We’ll remember it on this device.',
        }
      : {
          title: 'Chọn điểm bắt đầu',
          hint: 'Chọn 1 lựa chọn. Site sẽ ghi nhớ trên trình duyệt này.',
        };
  }, [lang]);

  function onPick(o: Option) {
    try {
      localStorage.setItem(KEY, o.id);
    } catch {}
    window.location.href = o.href;
  }

  return (
    <div className="card">
      <div className="text-lg font-semibold">{ui.title}</div>
      <div className="text-muted mt-1 text-sm">{ui.hint}</div>
      <div className="mt-4 grid gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className="btn btn-secondary w-full justify-between rounded-2xl px-4 py-4 text-left"
            onClick={() => onPick(o)}
          >
            <span className="lang-vi">{o.label.vi}</span>
            <span className="lang-en">{o.label.en}</span>
            <span aria-hidden="true" className="text-muted opacity-60">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

