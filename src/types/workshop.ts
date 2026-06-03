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

export type WorkshopSignup = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  jobTitle: string | null;
  primaryInterest: string;
  question: string | null;
  language: string;
  sourcePath: string | null;
  eventId: string | null;
  eventTitle: { vi: string; en: string } | null;
  createdAt: string;
};
