import type { LocalizedString } from '../i18n/types';

export type SiteFaqItem = {
  question: LocalizedString;
  answer: LocalizedString;
};

/** Short homepage Q&A. Vietnamese is the default visible copy; English is the alternate. */
export const siteFaq: SiteFaqItem[] = [
  {
    question: {
      vi: 'Hub này dành cho ai?',
      en: 'Who is this hub for?',
      km: 'Hub នេះសម្រាប់អ្នកណា?',
    },
    answer: {
      vi: 'Người vừa bắt đầu với Cloudflare. Bạn có thể đang giữ một website, viết ứng dụng, hoặc muốn quản lý quyền truy cập của nhân viên. Chọn một lộ trình và đi hết lộ trình đó. Chưa cần nhớ tên từng sản phẩm.',
      en: 'People just getting started with Cloudflare. You might be looking after a website, building an app, or tightening how staff sign in. Pick one track and finish it. You do not have to memorize every product name first.',
      km: 'អ្នកទើបចាប់ផ្តើមជាមួយ Cloudflare។ អ្នកអាចមានគេហទំព័រ កំពុងសរសេរ app ឬចង់គ្រប់គ្រងសិទ្ធិចូលរបស់បុគ្គលិក។ ជ្រើសផ្លូវមួយ ហើយរៀនឱ្យចប់ផ្លូវនោះ។',
    },
  },
  {
    question: {
      vi: 'Học trên hub có mất phí không?',
      en: 'Does studying on this hub cost anything?',
      km: 'ការរៀនលើ hub នេះមានតម្លៃទេ?',
    },
    answer: {
      vi: 'Bài trên site này miễn phí: lộ trình, checklist và bài kiểm tra. Khi bạn vào dashboard Cloudflare để làm theo, tài khoản và các gói trả phí là phần của Cloudflare, tách khỏi hub.',
      en: 'The material on this site is free: tracks, checklists, and the quiz. When you follow along in the Cloudflare dashboard, the account and any paid plans belong to Cloudflare, separate from this hub.',
      km: 'មេរៀនលើគេហទំព័រនេះឥតគិតថ្លៃ៖ ផ្លូវសិក្សា checklist និង quiz។ គណនី Cloudflare និងគម្រោងបង់ប្រាក់គឺផ្នែករបស់ Cloudflare ដាច់ដោយឡែកពី hub។',
    },
  },
  {
    question: {
      vi: 'Ai giữ hub này?',
      en: 'Who maintains this hub?',
      km: 'អ្នកណាថែទាំ hub នេះ?',
    },
    answer: {
      vi: 'Cường Lê Sỹ giữ hub như một dự án cá nhân trong Orange Cloud. Bài học bám tài liệu công khai để người mới tự học.',
      en: 'Cường Lê Sỹ maintains the hub as a personal project inside Orange Cloud. Lessons follow public documentation so beginners can study on their own.',
      km: 'Cường Lê Sỹ ថែទាំ hub ជាគម្រោងផ្ទាល់ខ្លួនក្នុង Orange Cloud។ មេរៀនពឹងឯកសារសាធារណៈ ដើម្បីឱ្យអ្នកចាប់ផ្តើមរៀនដោយខ្លួនឯង។',
    },
  },
  {
    question: {
      vi: 'Orange Cloud nằm ở đâu?',
      en: 'Where is Orange Cloud?',
      km: 'Orange Cloud នៅឯណា?',
    },
    answer: {
      vi: 'Trang gốc là https://orangecloud.vn/. Hub học này là một dự án trong danh sách đó, cùng blog kỹ thuật, CF Ready và trang kiểm tra phủ edge.',
      en: 'The home page is https://orangecloud.vn/. This learning hub is one project on that list, alongside the engineering blog, CF Ready, and the edge-coverage check.',
      km: 'ទំព័រដើមគឺ https://orangecloud.vn/។ Hub សិក្សានេះជាគម្រោងមួយក្នុងបញ្ជីនោះ ជាមួយប្លុកបច្ចេកទេស CF Ready និងទំព័រពិនិត្យ edge។',
    },
  },
];
