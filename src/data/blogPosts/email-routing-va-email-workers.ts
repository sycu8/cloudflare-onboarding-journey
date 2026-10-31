import type { BlogPost } from '../blog';

/** TODO: expand to ≥400 words/lang · FAQ · hub backlinks · rewrite from sourceHints */
export const postEmailRoutingVaEmailWorkers: BlogPost = {
  slug: 'email-routing-va-email-workers',
  date: '2026-11-01',
  topic: 'developer-platform',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: "Email Routing và Email Workers: nhận mail rồi xử lý bằng code",
    en: "Email Routing and Email Workers: receive mail, then handle it in code",
  },
  description: {
    vi: "Forward domain mail không cần hộp thư riêng; Worker đọc phần từ/đến; khác Email Sending.",
    en: "Forward domain mail without a mailbox; Workers read from/to; different from Email Sending.",
  },
  excerpt: {
    vi: "Forward domain mail không cần hộp thư riêng; Worker đọc phần từ/đến; khác Email Sending.",
    en: "Forward domain mail without a mailbox; Workers read from/to; different from Email Sending.",
  },
  keywords: {
    vi: 'developer-platform, Cloudflare, học Cloudflare',
    en: 'developer-platform, Cloudflare, learn Cloudflare',
  },
  sections: [
    {
      heading: {
        vi: 'Giới thiệu',
        en: 'Introduction',
      },
      paragraphs: [
        {
          vi: "Forward domain mail không cần hộp thư riêng; Worker đọc phần từ/đến; khác Email Sending. (TODO: mở rộng ≥400 từ tiếng Việt.)",
          en: "Forward domain mail without a mailbox; Workers read from/to; different from Email Sending. (TODO: expand to ≥400 English words.)",
        },
      ],
    },
  ],
  faq: [
    {
      question: { vi: 'Câu hỏi mẫu?', en: 'Sample question?' },
      answer: { vi: 'TODO', en: 'TODO' },
    },
  ],
  sources: [
    {
      title: 'https://blog.cloudflare.com/tag/email-routing/',
      href: 'https://blog.cloudflare.com/tag/email-routing/',
    },
    {
      title: 'https://developers.cloudflare.com/email-routing/',
      href: 'https://developers.cloudflare.com/email-routing/',
    },
  ],
  relatedTrack: 'developer-platform',
  relatedProductSlugs: ["email-routing","workers"],
  relatedPostSlugs: [],
  hubLinks: [
    { href: '/blog/', label: { vi: 'Blog hub', en: 'Blog hub' } },
    { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
  ],
  diagramSlugs: [],
};
