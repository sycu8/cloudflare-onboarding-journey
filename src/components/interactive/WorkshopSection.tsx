import { useState } from 'react';
import WorkshopEventsList from './WorkshopEventsList';
import WorkshopForm from './WorkshopForm';

export default function WorkshopSection() {
  const [eventId, setEventId] = useState('');
  const [requireEvent, setRequireEvent] = useState(false);

  return (
    <div className="space-y-8">
      <WorkshopEventsList
        selectedId={eventId}
        onSelect={setEventId}
        onLoaded={(count) => setRequireEvent(count > 0)}
      />
      <WorkshopForm eventId={eventId} requireEvent={requireEvent} />
    </div>
  );
}
