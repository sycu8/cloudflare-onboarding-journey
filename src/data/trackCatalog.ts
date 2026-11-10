import type { LocalizedString } from '../i18n/types';
import type { Track } from './tracks';

/** Beginner → advanced. Slugs stay the same; only the index display uses this. */
export const TRACK_DISPLAY_ORDER: Track['slug'][] = [
  'application-services',
  'developer-platform',
  'cloudflare-one',
  'ai-security-adoption',
  'operational-excellence',
];

export type TrackIndexMeta = {
  level: LocalizedString;
  prereq: LocalizedString;
  suggestedStart?: boolean;
};

export const trackIndexMeta: Record<Track['slug'], TrackIndexMeta> = {
  'application-services': {
    level: { vi: 'Cơ bản', en: 'Basics' },
    prereq: {
      vi: 'Nếu DNS hay proxy còn mới, làm bước 0 trước.',
      en: 'If DNS or the proxy is new, do step 0 first.',
    },
    suggestedStart: true,
  },
  'developer-platform': {
    level: { vi: 'Trung bình', en: 'Intermediate' },
    prereq: {
      vi: 'Có thể bắt đầu bằng workers.dev. Muốn gắn domain riêng thì học Application Services trước.',
      en: 'You can start on workers.dev. Learn Application Services first if you want your own domain.',
    },
  },
  'cloudflare-one': {
    level: { vi: 'Nâng cao', en: 'Advanced' },
    prereq: {
      vi: 'Nên đã có tài khoản Cloudflare. Lộ trình này nặng về kiến trúc và cách rollout.',
      en: 'You should already have a Cloudflare account. This track is heavier on architecture and rollout.',
    },
  },
  'ai-security-adoption': {
    level: { vi: 'Nâng cao', en: 'Advanced' },
    prereq: {
      vi: 'Dễ hơn nếu bạn đã biết WAF, Zero Trust, hoặc AI Gateway — tùy vai trò của bạn.',
      en: 'Easier if you already know WAF, Zero Trust, or AI Gateway — depending on your role.',
    },
  },
  'operational-excellence': {
    level: { vi: 'Trung bình', en: 'Intermediate' },
    prereq: {
      vi: 'Nên đã có ít nhất một zone hoặc một Worker.',
      en: 'You should already have at least one zone or one Worker.',
    },
  },
};

export const foundationStep = {
  title: { vi: 'Nền tảng', en: 'Foundations' } satisfies LocalizedString,
  summary: {
    vi: 'Chưa quen DNS, proxy hay tài khoản Cloudflare? Đọc ba trang này trước khi vào lộ trình.',
    en: 'New to DNS, the proxy, or a Cloudflare account? Read these three pages before a track.',
  } satisfies LocalizedString,
  links: [
    {
      href: '/cloudflare-101',
      label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } satisfies LocalizedString,
    },
    {
      href: '/start-here',
      label: { vi: 'Bắt đầu tại đây', en: 'Start here' } satisfies LocalizedString,
    },
    {
      href: '/glossary',
      label: { vi: 'Thuật ngữ', en: 'Glossary' } satisfies LocalizedString,
    },
  ],
};

/** Sum of module duration numbers already in the track data. Not a new limit. */
export function estimatedTrackMinutes(track: Track): number | undefined {
  let sum = 0;
  let found = false;
  for (const mod of track.modules) {
    const source = mod.duration?.vi || mod.duration?.en || '';
    const match = source.match(/(\d+)/);
    if (!match) continue;
    sum += Number(match[1]);
    found = true;
  }
  return found ? sum : undefined;
}
