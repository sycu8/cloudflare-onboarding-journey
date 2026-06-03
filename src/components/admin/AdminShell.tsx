import type { ReactNode } from 'react';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export type AdminTab = 'overview' | 'events' | 'signups';

type Props = {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminEmail: string | null;
  children: ReactNode;
};

const NAV: { id: AdminTab; vi: string; en: string; icon: string }[] = [
  { id: 'overview', vi: 'Tổng quan', en: 'Overview', icon: '◫' },
  { id: 'events', vi: 'Sự kiện', en: 'Events', icon: '◷' },
  { id: 'signups', vi: 'Đăng ký', en: 'Registrations', icon: '☰' },
];

export default function AdminShell({ activeTab, onTabChange, adminEmail, children }: Props) {
  const activeNav = NAV.find((n) => n.id === activeTab);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark" aria-hidden="true">
            CF
          </span>
          <div>
            <p className="admin-brand-title">Hub Admin</p>
            <p className="admin-brand-sub">
              <span className="lang-vi">Quản lý workshop</span>
              <span className="lang-en">Workshop management</span>
            </p>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${activeTab === item.id ? 'admin-nav-item-active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="admin-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="lang-vi">{item.vi}</span>
              <span className="lang-en">{item.en}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <a className="admin-foot-link" href="/workshop/" target="_blank" rel="noopener noreferrer">
            <span className="lang-vi">Trang đăng ký công khai ↗</span>
            <span className="lang-en">Public registration page ↗</span>
          </a>
          <a className="admin-foot-link" href="/">
            <span className="lang-vi">← Về learning hub</span>
            <span className="lang-en">← Back to learning hub</span>
          </a>
        </div>
      </aside>

      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-page-title">
              {activeNav ? (
                <>
                  <span className="lang-vi">{activeNav.vi}</span>
                  <span className="lang-en">{activeNav.en}</span>
                </>
              ) : null}
            </h1>
            {adminEmail ? (
              <p className="admin-page-sub">
                <span className="lang-vi">Đăng nhập: </span>
                <span className="lang-en">Signed in: </span>
                {adminEmail}
              </p>
            ) : null}
          </div>
          <LanguageSwitcher />
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
