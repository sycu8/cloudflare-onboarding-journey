import { useState } from 'react';
import WorkshopCommunityEvents from './WorkshopCommunityEvents';
import WorkshopEventsList from './WorkshopEventsList';
import WorkshopForm from './WorkshopForm';

export default function WorkshopSection() {
  const [eventId, setEventId] = useState('');
  const [requireEvent, setRequireEvent] = useState(false);

  return (
    <div className="space-y-10">
      <WorkshopCommunityEvents />
      <div className="space-y-8 border-t border-[var(--cf-border)] pt-10">
        <header>
          <h2 className="text-lg font-semibold">
            <span className="lang-vi">Đăng ký qua Cloudflare Starter Hub</span>
            <span className="lang-en">Register via Cloudflare Starter Hub</span>
          </h2>
          <p className="text-muted mt-2 max-w-2xl text-sm">
            <span className="lang-vi">
              Các buổi workshop do hub tổ chức (khác với sự kiện cộng đồng trên Luma ở trên).
            </span>
            <span className="lang-en">
              Hub-hosted workshops (separate from the Luma community events above).
            </span>
          </p>
        </header>
        <WorkshopEventsList
          selectedId={eventId}
          onSelect={setEventId}
          onLoaded={(count) => setRequireEvent(count > 0)}
        />
        <WorkshopForm eventId={eventId} requireEvent={requireEvent} />
      </div>
    </div>
  );
}
