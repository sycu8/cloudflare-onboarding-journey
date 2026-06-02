import type { LocalizedString } from '../i18n/types';

export type ChecklistSection = {
  id: string;
  title: LocalizedString;
  items: { id: string; text: LocalizedString }[];
};

export const beginnerChecklist: ChecklistSection[] = [
  {
    id: 'goal',
    title: { vi: '1) Hiểu mục tiêu của bạn', en: '1) Understand your goal' },
    items: [
      { id: 'goal-1', text: { vi: 'Tôi biết mình muốn protect, build hay secure access', en: 'I know whether I want to protect, build, or secure access' } },
      { id: 'goal-2', text: { vi: 'Tôi biết Cloudflare track nào phù hợp với mục tiêu của mình', en: 'I know which Cloudflare track fits my goal' } },
      { id: 'goal-3', text: { vi: 'Tôi có thể giải thích flow user → Cloudflare → origin/app', en: 'I can explain user → Cloudflare → origin/app flow' } },
    ],
  },
  {
    id: 'protect',
    title: { vi: '2) Nếu bạn protect applications', en: '2) If you protect applications' },
    items: [
      { id: 'p-1', text: { vi: 'Tôi có domain', en: 'I have a domain' } },
      { id: 'p-2', text: { vi: 'Tôi biết DNS records của mình', en: 'I know my DNS records' } },
      { id: 'p-3', text: { vi: 'Tôi biết records nào nên được proxied', en: 'I know which records should be proxied' } },
      { id: 'p-4', text: { vi: 'Tôi biết origin address', en: 'I know my origin address' } },
      { id: 'p-5', text: { vi: 'Tôi biết khác nhau giữa static và dynamic content', en: 'I know the difference between static and dynamic content' } },
      { id: 'p-6', text: { vi: 'Tôi biết các critical paths: login, API, checkout, admin', en: 'I know my critical paths: login, API, checkout, admin' } },
    ],
  },
  {
    id: 'build',
    title: { vi: '3) Nếu bạn build applications', en: '3) If you build applications' },
    items: [
      { id: 'b-1', text: { vi: 'Tôi biết app của mình là static, server-rendered, API-based hay full-stack', en: 'I know whether my app is static, server-rendered, API-based, or full-stack' } },
      { id: 'b-2', text: { vi: 'Tôi biết mình cần database, object storage hay key-value storage', en: 'I know whether I need database, object storage, or key-value storage' } },
      { id: 'b-3', text: { vi: 'Tôi có thể deploy basic Pages site', en: 'I can deploy a basic Pages site' } },
      { id: 'b-4', text: { vi: 'Tôi có thể tạo simple Worker/API route', en: 'I can create a simple Worker/API route' } },
    ],
  },
  {
    id: 'secure',
    title: { vi: '4) Nếu bạn secure users/workforce', en: '4) If you secure users/workforce' },
    items: [
      { id: 's-1', text: { vi: 'Tôi biết identity provider của mình', en: 'I know my identity provider' } },
      { id: 's-2', text: { vi: 'Tôi có danh sách private applications', en: 'I have a list of private applications' } },
      { id: 's-3', text: { vi: 'Tôi biết users/groups nào cần access', en: 'I know which users/groups need access' } },
      { id: 's-4', text: { vi: 'Tôi biết first use case là VPN replacement, secure browsing, SaaS security hay DLP', en: 'I know whether my first use case is VPN replacement, secure browsing, SaaS security, or DLP' } },
    ],
  },
  {
    id: 'current',
    title: { vi: '5) Cập nhật & tài liệu chính thức', en: '5) Stay current & official docs' },
    items: [
      { id: 'c-1', text: { vi: 'Tôi đã bookmark developers.cloudflare.com cho track của mình', en: 'I bookmarked developers.cloudflare.com for my track' } },
      { id: 'c-2', text: { vi: 'Tôi biết phân biệt Workers AI vs AI Gateway', en: 'I know the difference between Workers AI and AI Gateway' } },
      { id: 'c-3', text: { vi: 'Tôi dùng Cloudflare Tunnel (không tìm “Argo Tunnel” cũ)', en: 'I use Cloudflare Tunnel (not the old “Argo Tunnel” name)' } },
      { id: 'c-4', text: { vi: 'Tôi đã xem lộ trình 7 ngày hoặc Resource Hub trong hub này', en: 'I reviewed the 7-day path or Resource Hub in this hub' } },
    ],
  },
];

