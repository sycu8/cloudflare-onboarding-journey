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
      vi: 'Meetup đặc biệt tháng 6/2026 tại Đà Nẵng — buổi chào sân đầu tiên của cộng đồng Cloudflare Việt Nam: demo, hands-on Workers/Pages/R2/Durable Objects, networking và mini game quay số voucher Grab (tới 500.000đ).',
      en: 'Special June 2026 meetup in Da Nang — the inaugural Vietnam Cloudflare community PeerPoint: demos, hands-on Workers/Pages/R2/Durable Objects, networking, and a lucky-draw for Grab vouchers (up to 500,000 VND).',
    },
    startsAt: '2026-06-19T11:00:00.000Z',
    endsAt: '2026-06-19T14:00:00.000Z',
    timezone: 'Asia/Ho_Chi_Minh',
    format: 'in-person',
    location: {
      vi: 'Enouvo IT Solutions · 538 Ngô Quyền, An Hải, Đà Nẵng',
      en: 'Enouvo IT Solutions · 538 Ngo Quyen, An Hai, Da Nang',
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
        'Khám phá Cloudflare Developer Platform và các dịch vụ hỗ trợ developers',
        'Demo và triển khai thực tế Workers, Pages, R2, Durable Objects',
        'Chia sẻ từ team product và diễn giả cộng đồng',
        'Networking với cộng đồng Cloudflare Việt Nam',
        'Mini game quay số voucher Grab (tới 500.000đ)',
      ],
      en: [
        'Explore the Cloudflare Developer Platform and developer services',
        'Live demos and hands-on deployment of Workers, Pages, R2, and Durable Objects',
        'Talks from product practitioners and community speakers',
        'Networking with the Vietnam Cloudflare community',
        'Lucky draw for Grab vouchers (up to 500,000 VND)',
      ],
    },
    notes: {
      vi: [
        'Thứ Sáu, 19/06/2026 · 18:00–21:00 (ICT)',
        'Miễn phí tham dự',
        'Nhớ mang laptop để làm hands-on lab',
      ],
      en: [
        'Friday, 19 June 2026 · 6:00–9:00 PM (ICT)',
        'Free to attend',
        'Bring your laptop for the hands-on lab',
      ],
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
