/** Static community / external events (e.g. Luma PeerPoint meetups). */
export type CommunityEvent = {
  id: string;
  title: { vi: string; en: string };
  summary: { vi: string; en: string };
  startsAt: string;
  endsAt: string;
  timezone: string;
  format: 'in-person' | 'online' | 'hybrid';
  location: { vi: string; en: string };
  language: { vi: string; en: string };
  registrationUrl: string;
  host: string;
  speakers: Array<{ name: string; role: { vi: string; en: string } }>;
  highlights: { vi: string[]; en: string[] };
  notes: { vi: string[]; en: string[] };
  contact: { vi: string; en: string };
  free: boolean;
  source: 'luma';
  sourceUrl: string;
};

export const communityEvents: CommunityEvent[] = [
  {
    id: 'peerpoint-da-nang-2026-06',
    title: {
      vi: 'Da Nang – Cloudflare PeerPoint',
      en: 'Da Nang – Cloudflare PeerPoint',
    },
    summary: {
      vi: 'Meetup chào sân đầu tiên của cộng đồng Cloudflare tại Đà Nẵng — demo và hands-on Workers, Pages, R2, Durable Objects.',
      en: 'The inaugural Cloudflare community meetup in Da Nang — demos and hands-on labs for Workers, Pages, R2, and Durable Objects.',
    },
    startsAt: '2026-06-19T08:00:00.000Z',
    endsAt: '2026-06-19T10:00:00.000Z',
    timezone: 'Asia/Ho_Chi_Minh',
    format: 'in-person',
    location: {
      vi: 'Đà Nẵng (Hải Châu) — địa điểm sẽ cập nhật',
      en: 'Da Nang (Hai Chau) — venue to be announced',
    },
    language: {
      vi: 'Tiếng Việt, lai tiếng Anh',
      en: 'Vietnamese with some English',
    },
    registrationUrl: 'https://luma.com/8y2xy93w',
    host: 'Cuong Le',
    speakers: [
      { name: 'Lưu Tuấn Anh', role: { vi: 'Sr. Solutions Engineer — Cloudflare', en: 'Sr. Solutions Engineer — Cloudflare' } },
      { name: 'Trần Tuấn Anh', role: { vi: 'Head of Cloud Solutions — FPT Telecom International', en: 'Head of Cloud Solutions — FPT Telecom International' } },
      { name: 'Tình Nguyễn', role: { vi: 'AI & Data Expert — LionTech', en: 'AI & Data Expert — LionTech' } },
      { name: 'Hòa Lưu', role: { vi: 'Cloud Engineer — LionTech', en: 'Cloud Engineer — LionTech' } },
      { name: 'Sử Minh Thành', role: { vi: 'Founder VibeCode.edu.vn — Cloudflare Community Builder', en: 'Founder VibeCode.edu.vn — Cloudflare Community Builder' } },
      { name: 'Lê Sỹ Cường', role: { vi: 'Territory Account Executive — Cloudflare', en: 'Territory Account Executive — Cloudflare' } },
      { name: 'Nguyễn Hữu Nguyên Ý', role: { vi: 'Cloudflare Community Builder', en: 'Cloudflare Community Builder' } },
    ],
    highlights: {
      vi: [
        'Khám phá Cloudflare Developer Platform và các dịch vụ cho developers',
        'Demo và triển khai thực tế Workers, Pages, R2, Durable Objects',
        'Chia sẻ từ đội ngũ product và diễn giả cộng đồng',
        'Networking với cộng đồng Cloudflare Việt Nam',
      ],
      en: [
        'Explore the Cloudflare Developer Platform and developer services',
        'Live demos and hands-on deployment of Workers, Pages, R2, and Durable Objects',
        'Talks from product practitioners and community speakers',
        'Networking with the Vietnam Cloudflare community',
      ],
    },
    notes: {
      vi: ['Miễn phí tham dự', 'Nhớ mang laptop để làm hands-on lab'],
      en: ['Free to attend', 'Bring your laptop for the hands-on lab'],
    },
    contact: {
      vi: 'Liên hệ Mr. Cường (0369 161 494) hoặc Mr. Ý (0773 288 148)',
      en: 'Contact Mr. Cường (0369 161 494) or Mr. Ý (0773 288 148)',
    },
    free: true,
    source: 'luma',
    sourceUrl: 'https://luma.com/8y2xy93w',
  },
];

export function splitCommunityEvents(now = new Date()) {
  const upcoming = communityEvents
    .filter((e) => new Date(e.endsAt) >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const past = communityEvents
    .filter((e) => new Date(e.endsAt) < now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
  return { upcoming, past };
}
