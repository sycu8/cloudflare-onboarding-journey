import type { LocalizedString } from '../i18n/types';

/** Chrome copy for tutorial hub pages (vi / en / km). Product names stay English. */
export const tutorialChrome = {
  notesBefore: { vi: 'Lưu ý trước khi làm', en: 'Notes before you start', km: 'ចំណាំមុនពេលចាប់ផ្តើម' },
  notesKind: { vi: 'Lưu ý', en: 'Note', km: 'ចំណាំ' },
  quickContext: { vi: 'Giải thích nhanh', en: 'Quick context', km: 'បរិបទរហ័ស' },
  openSourceSection: { vi: 'Mở section docs gốc ↗', en: 'Open source section ↗', km: 'បើកផ្នែក docs ផ្លូវការ ↗' },
  relatedLinks: {
    vi: 'Liên kết liên quan (docs Cloudflare)',
    en: 'Related links (Cloudflare docs)',
    km: 'តំណពាក់ព័ន្ធ (docs Cloudflare)',
  },
  toc: { vi: 'Mục lục', en: 'On this page', km: 'មាតិកា' },
  docsGoc: { vi: '↗ docs gốc', en: '↗ docs', km: '↗ docs ផ្លូវការ' },
  minutes: { vi: 'phút', en: 'min', km: 'នាទី' },
  synced: { vi: 'Đồng bộ', en: 'Synced', km: 'ធ្វើសមកាល' },
  catalog: { vi: '← Danh mục', en: '← Catalog', km: '← បញ្ជី' },
  officialDocs: { vi: 'Tài liệu gốc ↗', en: 'Official docs ↗', km: 'ឯកសារផ្លូវការ ↗' },
  lastReviewed: {
    vi: 'Tài liệu gốc — rà soát lần cuối:',
    en: 'Official docs — last reviewed:',
    km: 'ឯកសារផ្លូវការ — ពិនិត្យចុងក្រោយ:',
  },
  guideLead: {
    vi: 'Hướng dẫn chi tiết đồng bộ từ docs Cloudflare — mỗi section có backlink tới đúng vị trí trên trang gốc.',
    en: 'Detailed guide synced from Cloudflare docs — each section links to the matching anchor on the official page.',
    km: 'មគ្គុទ្ទេសក៍លម្អិតធ្វើសមកាលពី docs Cloudflare — ផ្នែកនីមួយៗមានតំណទៅទីតាំងត្រូវគ្នានៅទំព័រផ្លូវការ។',
  },
  viewFull: {
    vi: 'Xem bản đầy đủ trên developers.cloudflare.com (ảnh, tab cấu hình).',
    en: 'View the full guide on developers.cloudflare.com (images, config tabs).',
    km: 'មើលមគ្គុទ្ទេសក៍ពេញលើ developers.cloudflare.com (រូបភាព, tab កំណត់)។',
  },
  notSynced: {
    vi: 'Nội dung chi tiết chưa được đồng bộ — mở tài liệu gốc hoặc chạy lại resources:crawl-previews.',
    en: 'Detailed content not synced yet — open the official doc or re-run resources:crawl-previews.',
    km: 'ខ្លឹមសារលម្អិតមិនទាន់ធ្វើសមកាល — បើកឯកសារផ្លូវការ ឬរត់ resources:crawl-previews ម្ដងទៀត។',
  },
  tutorialMissing: {
    vi: 'Tutorial chưa được đồng bộ. Quay lại sau khi catalog được crawl hoặc mở tài liệu gốc bên dưới.',
    en: 'Tutorial not synced yet. Check back after the next catalog sync or open the official doc below.',
    km: 'Tutorial មិនទាន់ធ្វើសមកាល។ ត្រឡប់មកវិញបន្ទាប់ពី sync catalog ឬបើកឯកសារផ្លូវការខាងក្រោម។',
  },
  resources: { vi: 'Tài nguyên', en: 'Resources', km: 'ធនធាន' },
} as const satisfies Record<string, LocalizedString>;
