import type { LocalizedString } from '../i18n/types';

/** Chrome copy for Developer Labs hub pages (vi / en / km). */
export const labChrome = {
  labsIndex: { vi: 'Developer Labs', en: 'Developer Labs', km: 'Developer Labs' },
  startWorkers: { vi: 'Bắt đầu từ Workers', en: 'Start with Workers', km: 'ចាប់ផ្តើមពី Workers' },
  startLab1: { vi: 'Bắt đầu lab 1', en: 'Start lab 1', km: 'ចាប់ផ្តើម lab 1' },
  openOnHub: { vi: 'Mở lab trên hub', en: 'Open labs on this hub', km: 'បើក lab នៅលើ hub នេះ' },
  fitsPath: { vi: 'Ghép với lộ trình hub', en: 'Fits this hub path', km: 'សមនឹងផ្លូវ hub នេះ' },
  prerequisites: { vi: 'Cần trước', en: 'Prerequisites', km: 'តម្រូវការជាមុន' },
  objectives: { vi: 'Bạn sẽ làm được', en: 'Learning objectives', km: 'គោលបំណងសិក្សា' },
  challenge: { vi: 'Thử thách', en: 'Challenge', km: 'ការសាកល្បង' },
  doneAll: { vi: 'Xong · về 4 track lab', en: 'Done · all lab tracks', km: 'រួចរាល់ · 4 track lab' },
  sourceNote: {
    vi: 'Nội dung bước (lệnh, code) giữ nguyên tiếng Anh từ nguồn chính thức.',
    en: 'Step body (commands, code) stays in English from the official source.',
    km: 'ខ្លឹមសារជំហាន (ពាក្យបញ្ជា និង code) រក្សាភាសាអង់គ្លេសពីប្រភពផ្លូវការ។',
  },
  trackLabs: {
    vi: 'Lab thực hành (nguồn bổ sung)',
    en: 'Hands-on labs (supplementary)',
    km: 'Lab អនុវត្ត (ប្រភពបន្ថែម)',
  },
  resourcesLabs: {
    vi: 'Developer Labs — làm rồi mới đọc thêm',
    en: 'Developer Labs — ship something real',
    km: 'Developer Labs — ធ្វើសិនទើបអានបន្ថែម',
  },
  minutes: { vi: 'phút', en: 'min', km: 'នាទី' },
  pageTitle: {
    vi: 'Developer Labs · Developer Platform',
    en: 'Developer Labs · Developer Platform',
    km: 'Developer Labs · Developer Platform',
  },
  indexDesc: {
    vi: '23 bài lab guided từ labs.cloudflare.dev — Workers, MCP, Agents SDK, Sandbox SDK — đọc và làm ngay trên hub.',
    en: '23 guided labs from labs.cloudflare.dev — Workers, MCP, Agents SDK, Sandbox SDK — follow them on this hub.',
    km: 'Lab guided 23 ពី labs.cloudflare.dev — Workers, MCP, Agents SDK, Sandbox SDK — អាន និងធ្វើនៅលើ hub នេះ។',
  },
} as const satisfies Record<string, LocalizedString>;

export const labCalloutKindLabel: Record<string, LocalizedString> = {
  note: { vi: 'Lưu ý', en: 'Note', km: 'ចំណាំ' },
  tip: { vi: 'Mẹo', en: 'Tip', km: 'គន្លឹះ' },
  important: { vi: 'Quan trọng', en: 'Important', km: 'សំខាន់' },
  caution: { vi: 'Cẩn thận', en: 'Caution', km: 'ប្រុងប្រយ័ត្ន' },
  warning: { vi: 'Cảnh báo', en: 'Warning', km: 'ព្រមាន' },
  danger: { vi: 'Nguy hiểm', en: 'Danger', km: 'គ្រោះថ្នាក់' },
  tool: { vi: 'Công cụ', en: 'Tool', km: 'ឧបករណ៍' },
  globe: { vi: 'Mở rộng', en: 'Global', km: 'សកល' },
};
