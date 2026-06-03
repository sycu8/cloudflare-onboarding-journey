import { useState } from 'react';
import { usePageLang } from '../../lib/usePageLang';
import { useWorkshopAdminAuth } from '../../lib/useWorkshopAdminAuth';
import AdminAccessDenied from './AdminAccessDenied';
import AdminOverview from './AdminOverview';
import AdminShell, { type AdminTab } from './AdminShell';
import WorkshopEventsAdmin from './WorkshopEventsAdmin';
import WorkshopSignupsAdmin from '../interactive/WorkshopSignupsAdmin';

export default function AdminApp() {
  const lang = usePageLang();
  const { authenticated, adminEmail, authInfo, events, loading, error, reload } = useWorkshopAdminAuth(lang);
  const [tab, setTab] = useState<AdminTab>('overview');

  if (loading && !authenticated) {
    return (
      <div className="admin-loading">
        <div className="card text-muted text-sm">
          <span className="lang-vi">Đang xác thực Cloudflare Access…</span>
          <span className="lang-en">Verifying Cloudflare Access…</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-loading">
        <AdminAccessDenied authInfo={authInfo} adminEmail={adminEmail} error={error} />
      </div>
    );
  }

  return (
    <AdminShell activeTab={tab} onTabChange={setTab} adminEmail={adminEmail}>
      {tab === 'overview' ? (
        <AdminOverview
          events={events}
          active={tab === 'overview'}
          onGoEvents={() => setTab('events')}
          onGoSignups={() => setTab('signups')}
        />
      ) : null}
      {tab === 'events' ? <WorkshopEventsAdmin events={events} onCreated={() => void reload()} /> : null}
      {tab === 'signups' ? <WorkshopSignupsAdmin active={tab === 'signups'} /> : null}
    </AdminShell>
  );
}
