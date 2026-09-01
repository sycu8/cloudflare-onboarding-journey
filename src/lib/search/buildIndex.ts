import { blogIntro, blogPosts } from '../../data/blog';
import { cf101TerminologySections } from '../../data/cf101Terminology';
import { getAllFlatTrackLessons } from '../../data/trackLessons';
import { glossary } from '../../data/glossary';
import { mobileNavMore, primaryNavItems } from '../../data/navigation';
import { productPages } from '../../data/productPages';
import { resources } from '../../data/resources';
import { tracks } from '../../data/tracks';
import { useCases } from '../../data/useCases';
import { roleRoadmaps } from '../../data/roleRoadmaps';
import { contentRoadmapStages } from '../../data/contentRoadmap';
import { getAllTutorialPreviews, getTutorialHubPath } from '../../data/tutorialPreviews';
import { developerLabTracks, developerLabsIntro } from '../../data/developerLabs';
import type { SearchDocument } from '../../types/search';

function doc(
  id: string,
  href: string,
  title: { vi: string; en: string; km?: string },
  description: { vi: string; en: string; km?: string },
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
      title: { vi: 'Trang chủ', en: 'Home', km: 'ទំព័រដើម' },
      description: {
        vi: 'Bắt đầu học Cloudflare từ con số 0 — lộ trình, checklist, quiz.',
        en: 'Start learning Cloudflare from zero — tracks, checklist, quiz.',
        km: 'ចាប់ផ្តើមរៀន Cloudflare ពីសូន្យ — tracks, checklist, quiz.',
      },
      category: 'Hub',
    },
    {
      href: '/start-here/',
      title: { vi: 'Bắt đầu tại đây', en: 'Start here', km: 'ចាប់ផ្តើមនៅទីនេះ' },
      description: {
        vi: 'Điểm khởi đầu cho người mới — chọn lộ trình và bước tiếp theo.',
        en: 'Starting point for beginners — pick a path and next steps.',
        km: 'ចំណុចចាប់ផ្តើមសម្រាប់អ្នកថ្មី — ជ្រើសរើសផ្លូវ និងជំហានបន្ទាប់។',
      },
      category: 'Hub',
    },
    {
      href: '/cloudflare-101/',
      title: { vi: 'Cloudflare 101', en: 'Cloudflare 101', km: 'Cloudflare 101' },
      description: {
        vi: 'Thuật ngữ, hướng dẫn thực hành DNS/TLS/WAF và bản đồ sản phẩm.',
        en: 'Terminology, practical DNS/TLS/WAF guides, and product map.',
        km: 'ពាក្យបច្ចេកទេស, មគ្គុទ្ទេសក៍ DNS/TLS/WAF និងផែនទីផលិតផល។',
      },
      category: 'Learning',
    },
    {
      href: '/first-week/',
      title: { vi: 'Lộ trình 7 ngày', en: '7-day path', km: 'ផ្លូវ 7 ថ្ងៃ' },
      description: {
        vi: 'Kế hoạch học Cloudflare trong tuần đầu.',
        en: 'A one-week plan to learn Cloudflare.',
        km: 'ផែនការរៀន Cloudflare ក្នុងសប្តាហ៍ទីមួយ។',
      },
      category: 'Learning',
    },
    {
      href: '/workshop/',
      title: { vi: 'Hội thảo & sự kiện', en: 'Workshops & events', km: 'Workshop & ព្រឹត្តិការណ៍' },
      description: {
        vi: 'Sự kiện cộng đồng PeerPoint và đăng ký workshop.',
        en: 'PeerPoint community events and workshop registration.',
        km: 'ព្រឹត្តិការណ៍សហគមន៍ PeerPoint និងការចុះឈ្មោះ workshop។',
      },
      category: 'Community',
    },
    {
      href: '/glossary/',
      title: { vi: 'Thuật ngữ', en: 'Glossary', km: 'Glossary' },
      description: {
        vi: 'Từ điển thuật ngữ Cloudflare song ngữ.',
        en: 'Bilingual Cloudflare glossary.',
        km: 'វចនានុក្រម Cloudflare ពហុភាសា។',
      },
      category: 'Reference',
    },
    {
      href: '/search/',
      title: { vi: 'Tìm kiếm', en: 'Search', km: 'ស្វែងរក' },
      description: {
        vi: 'Tìm trang, thuật ngữ và nội dung học trên hub.',
        en: 'Find pages, terms, and learning content on the hub.',
        km: 'ស្វែងរកទំព័រ, ពាក្យ, និងមាតិកាសិក្សានៅលើ hub។',
      },
      category: 'Hub',
    },
    {
      href: '/content-roadmap/',
      title: { vi: 'Lộ trình nội dung', en: 'Content Roadmap', km: 'Content Roadmap' },
      description: {
        vi: 'Học từ Internet, DNS, CDN đến Cloudflare — lộ trình từ con số 0.',
        en: 'Learn from Internet, DNS, CDN to Cloudflare — zero-to-hero path.',
        km: 'រៀនពី Internet, DNS, CDN ទៅ Cloudflare — ផ្លូវពីសូន្យ។',
      },
      category: 'Learning',
    },
    {
      href: '/roadmaps/',
      title: { vi: 'Roadmap theo vai trò', en: 'Role roadmaps', km: 'Role roadmaps' },
      description: {
        vi: 'Lộ trình cho Sales, SE, Developer, IT Admin, Founder, Student.',
        en: 'Roadmaps for Sales, SE, Developer, IT Admin, Founder, Student.',
        km: 'Roadmaps for Sales, SE, Developer, IT Admin, Founder, Student.',
      },
      category: 'Learning',
    },
    {
      href: '/cheatsheets/ai-protection-portfolio/',
      title: { vi: 'Cheatsheet bảo vệ AI', en: 'AI Protection Portfolio cheatsheet' },
      description: {
        vi: 'CASB, SWG, RBI, AI Gateway, WAF/Bots và Radar cho AI security.',
        en: 'CASB, SWG, RBI, AI Gateway, WAF/Bots, and Radar for AI security.',
      },
      category: 'Reference',
    },
    {
      href: '/blog/',
      title: { vi: 'Blog học Cloudflare', en: 'Cloudflare learning blog' },
      description: blogIntro,
      category: 'Blog',
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

  for (const role of roleRoadmaps) {
    out.push(
      doc(
        `role-roadmap-${role.roleId}`,
        `/roadmaps/${role.roleId}/`,
        { vi: `Roadmap ${role.roleNameVi}`, en: `${role.roleNameEn ?? role.roleNameVi} roadmap` },
        { vi: role.descriptionVi, en: role.descriptionEn ?? role.descriptionVi },
        'Role roadmap',
        role.primaryTrack,
      ),
    );
    for (const step of role.steps) {
      out.push(
        doc(
          `role-week-${step.id}`,
          `/roadmaps/${role.roleId}/#${step.id}`,
          {
            vi: `${role.roleNameVi} — Tuần ${step.week}: ${step.titleVi}`,
            en: `${role.roleNameEn ?? role.roleNameVi} — Week ${step.week}: ${step.titleEn ?? step.titleVi}`,
          },
          {
            vi: step.objectiveVi,
            en: step.objectiveEn ?? step.objectiveVi,
          },
          'Role roadmap',
          `${role.roleId} week-${step.week}`,
        ),
      );
    }
  }

  for (const stage of contentRoadmapStages) {
    for (const topic of stage.topics) {
      out.push(
        doc(
          `content-topic-${topic.id}`,
          `/content-roadmap/#${topic.id}`,
          { vi: topic.titleVi, en: topic.titleEn ?? topic.titleVi },
          { vi: topic.summaryVi, en: topic.summaryEn ?? topic.summaryVi },
          'Content Roadmap',
          topic.filterTags.join(' '),
        ),
      );
    }
  }

  out.push(
    doc(
      'developer-labs',
      '/tracks/developer-platform/#developer-labs',
      { vi: 'Developer Labs', en: 'Developer Labs', km: 'Developer Labs' },
      developerLabsIntro,
      'Lab',
      'labs.cloudflare.dev workers mcp agents sandbox',
    ),
  );

  for (const lab of developerLabTracks) {
    out.push(
      doc(
        `developer-lab-${lab.id}`,
        `/tracks/developer-platform/#lab-${lab.id}`,
        lab.title,
        lab.description,
        'Lab',
        `${lab.tags.join(' ')} ${lab.outcome.en}`,
      ),
    );
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

  for (const preview of getAllTutorialPreviews()) {
    const href = getTutorialHubPath({ path: preview.path });
    out.push(
      doc(
        `tutorial-preview-${preview.path}`,
        href,
        {
          vi: preview.titleVi ?? preview.title,
          en: preview.title,
          km: preview.titleKm ?? preview.title,
        },
        {
          vi: preview.summaryVi,
          en: preview.summaryEn || preview.summaryVi,
          km: preview.summaryKm ?? preview.summaryEn ?? preview.summaryVi,
        },
        'Tutorial preview',
        `${preview.track} ${preview.contentType}`,
      ),
    );
  }

  for (const post of blogPosts) {
    out.push(
      doc(
        `blog-${post.slug}`,
        `/blog/${post.slug}/`,
        post.title,
        post.description,
        'Blog',
        `${post.topic} ${post.level} ${post.keywords.en} ${post.keywords.vi}`,
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
