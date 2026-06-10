import { cf101TerminologySections } from '../../data/cf101Terminology';
import { getAllFlatTrackLessons } from '../../data/trackLessons';
import { glossary } from '../../data/glossary';
import { mobileNavMore, primaryNavItems } from '../../data/navigation';
import { productPages } from '../../data/productPages';
import { resources } from '../../data/resources';
import { tracks } from '../../data/tracks';
import { useCases } from '../../data/useCases';
import type { SearchDocument } from '../../types/search';

function doc(
  id: string,
  href: string,
  title: { vi: string; en: string },
  description: { vi: string; en: string },
  category?: string,
  keywords?: string,
): SearchDocument {
  return { id, href, title, description, category, keywords };
}

/** Aggregates bilingual hub content for instant (keyword) search. */
export function buildSearchDocuments(): SearchDocument[] {
  const out: SearchDocument[] = [];

  const staticPages: Array<{ href: string; title: SearchDocument['title']; description: SearchDocument['title']; category: string }> = [
    {
      href: '/',
      title: { vi: 'Trang chủ', en: 'Home' },
      description: {
        vi: 'Bắt đầu học Cloudflare từ con số 0 — lộ trình, checklist, quiz.',
        en: 'Start learning Cloudflare from zero — tracks, checklist, quiz.',
      },
      category: 'Hub',
    },
    {
      href: '/start-here/',
      title: { vi: 'Bắt đầu tại đây', en: 'Start here' },
      description: {
        vi: 'Điểm khởi đầu cho người mới — chọn lộ trình và bước tiếp theo.',
        en: 'Starting point for beginners — pick a path and next steps.',
      },
      category: 'Hub',
    },
    {
      href: '/cloudflare-101/',
      title: { vi: 'Cloudflare 101', en: 'Cloudflare 101' },
      description: {
        vi: 'Thuật ngữ, hướng dẫn thực hành DNS/TLS/WAF và bản đồ sản phẩm.',
        en: 'Terminology, practical DNS/TLS/WAF guides, and product map.',
      },
      category: 'Learning',
    },
    {
      href: '/first-week/',
      title: { vi: 'Lộ trình 7 ngày', en: '7-day path' },
      description: {
        vi: 'Kế hoạch học Cloudflare trong tuần đầu.',
        en: 'A one-week plan to learn Cloudflare.',
      },
      category: 'Learning',
    },
    {
      href: '/workshop/',
      title: { vi: 'Hội thảo & sự kiện', en: 'Workshops & events' },
      description: {
        vi: 'Sự kiện cộng đồng PeerPoint và đăng ký workshop.',
        en: 'PeerPoint community events and workshop registration.',
      },
      category: 'Community',
    },
    {
      href: '/glossary/',
      title: { vi: 'Thuật ngữ', en: 'Glossary' },
      description: { vi: 'Từ điển thuật ngữ Cloudflare song ngữ.', en: 'Bilingual Cloudflare glossary.' },
      category: 'Reference',
    },
    {
      href: '/search/',
      title: { vi: 'Tìm kiếm', en: 'Search' },
      description: {
        vi: 'Tìm trang, thuật ngữ và nội dung học trên hub.',
        en: 'Find pages, terms, and learning content on the hub.',
      },
      category: 'Hub',
    },
  ];

  for (const page of staticPages) {
    out.push(doc(page.href, page.href, page.title, page.description, page.category));
  }

  for (const item of [...primaryNavItems, ...mobileNavMore]) {
    if (out.some((d) => d.href === item.href)) continue;
    out.push(
      doc(
        `nav-${item.href}`,
        item.href,
        item.label,
        { vi: `Trang ${item.label.vi}`, en: `${item.label.en} page` },
        'Navigation',
      ),
    );
  }

  for (const track of tracks) {
    out.push(
      doc(
        `track-${track.slug}`,
        `/tracks/${track.slug}/`,
        track.title,
        track.description,
        'Track',
        track.keyConcepts.join(' '),
      ),
    );
  }

  for (const lesson of getAllFlatTrackLessons()) {
    out.push(
      doc(
        `lesson-${lesson.id}`,
        `/tracks/${lesson.trackSlug}/${lesson.id}/`,
        lesson.title,
        lesson.body,
        'Lesson',
        `${lesson.trackTitle.en} ${lesson.moduleTitle.en}`,
      ),
    );
  }

  for (const uc of useCases) {
    out.push(
      doc(
        `use-case-${uc.slug}`,
        `/use-cases/${uc.slug}/`,
        uc.title,
        uc.problem,
        'Use case',
        uc.relatedTrack,
      ),
    );
  }

  for (const product of productPages) {
    out.push(
      doc(
        `product-${product.slug}`,
        `/products/${product.slug}/`,
        product.name,
        product.summary,
        'Product',
        `${product.categoryLabel.en} ${product.relatedTrack}`,
      ),
    );
  }

  for (const term of glossary) {
    out.push(
      doc(
        `glossary-${term.term}`,
        '/glossary/',
        { vi: term.term, en: term.term },
        term.definition,
        'Glossary',
        `${term.category} ${term.relatedTrack}`,
      ),
    );
  }

  for (const section of cf101TerminologySections) {
    for (const term of section.terms) {
      out.push(
        doc(
          `cf101-${section.id}-${term.term}`,
          '/cloudflare-101/#terminology',
          { vi: term.term, en: term.term },
          term.definition,
          'Cloudflare 101',
          section.title.en,
        ),
      );
    }
  }

  for (const resource of resources) {
    if (resource.status !== 'available') continue;
    out.push(
      doc(
        `resource-${resource.slug}`,
        resource.href,
        resource.title,
        resource.description,
        'Resource',
        resource.type,
      ),
    );
  }

  const seen = new Set<string>();
  return out.filter((d) => {
    const key = `${d.href}::${d.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
