export type WorkshopEventFormat = 'online' | 'in-person' | 'hybrid';
export type WorkshopEventStatus = 'draft' | 'published' | 'cancelled';

export type WorkshopEvent = {
  id: string;
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  startsAt: string;
  endsAt: string | null;
  timezone: string;
  format: WorkshopEventFormat;
  location: { vi: string; en: string } | null;
  meetingUrl: string | null;
  capacity: number | null;
  primaryInterest: string | null;
  status: WorkshopEventStatus;
  createdAt: string;
  updatedAt: string;
};
