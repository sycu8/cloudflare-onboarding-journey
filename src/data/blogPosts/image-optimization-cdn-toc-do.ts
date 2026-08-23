import type { BlogPost } from '../blog';

/** Entry · CDN — image optimization and delivery speed */
export const postImageOptimizationCdnTocDo: BlogPost = {
  slug: 'image-optimization-cdn-toc-do',
  date: '2026-09-22',
  topic: 'cdn',
  level: 'entry',
  readingMinutes: 7,
  title: {
    vi: 'Ảnh nặng làm chậm site: CDN và tối ưu ảnh trên Cloudflare',
    en: 'Heavy images slow sites: CDN and image optimization on Cloudflare',
  },
  description: {
    vi: 'Giải thích cho người mới: vì sao ảnh là thủ phạm phổ biến, CDN cache và Cloudflare Images/resize, tối ưu mobile — cache thôi không sửa ảnh quá lớn.',
    en: 'A beginner explainer: why images are common culprits, CDN cache and Cloudflare Images/resize, mobile tuning — raw cache alone does not fix oversized assets.',
  },
  excerpt: {
    vi: 'Một ảnh hero 4MB có thể chậm hơn cả trăm dòng HTML. CDN phân phối nhanh hơn; tối ưu ảnh giúp file nhẹ hơn trước khi cache — hai việc bổ sung, không thay thế.',
    en: 'One 4MB hero image can hurt more than a hundred lines of HTML. A CDN delivers faster; image optimization makes files lighter before cache — two jobs that complement, not replace, each other.',
  },
  keywords: {
    vi: 'tối ưu ảnh Cloudflare, CDN tốc độ, Images resize, WebP AVIF, tăng tốc website ảnh',
    en: 'Cloudflare image optimization, CDN speed, Images resize, WebP AVIF, speed up image-heavy sites',
  },
  sections: [
    {
      heading: {
        vi: 'Vì sao ảnh thường là “thủ phạm” đầu tiên khi site chậm?',
        en: 'Why images are often the first culprit when a site feels slow',
      },
      paragraphs: [
        {
          vi: 'Trang web hiện đại chứa nhiều ảnh: hero banner, gallery sản phẩm, avatar, thumbnail blog. Một file JPEG 3000px từ máy ảnh có thể nặng 2–5MB; mobile chỉ cần bản 800px. User mở trang trên 4G ở ngoài trời — họ chờ ảnh, không chờ text. Công cụ Lighthouse và PageSpeed thường chỉ ảnh ngay ở hàng đầu “opportunities”.',
          en: 'Modern pages carry many images: hero banners, product galleries, avatars, blog thumbnails. One 3000px JPEG from a camera can weigh 2–5MB; mobile only needs an 800px version. Users on 4G outdoors wait on images, not just text. Lighthouse and PageSpeed usually list images at the top of “opportunities.”',
        },
        {
          vi: 'CDN (như Cloudflare Cache) giúp giao file gần user — giảm độ trễ mạng. Nhưng nếu file vốn đã nặng, CDN chỉ “chuyển khối lớn nhanh hơn một chút”. Tối ưu ảnh giảm kích thước file: đúng định dạng (WebP/AVIF), đúng kích thước pixel, nén hợp lý. Trên blog.cloudflare.com, bài về images và CDN thường đi cặp: phân phối + biến đổi.',
          en: 'A CDN (like Cloudflare Cache) delivers files closer to users — less network latency. But if the file is already huge, the CDN only “moves a big block a bit faster.” Image optimization shrinks file size: right format (WebP/AVIF), right pixel dimensions, sensible compression. On blog.cloudflare.com, image and CDN posts often pair: distribution + transformation.',
        },
        {
          vi: 'Bài CDN cơ bản trên hub giải thích cache edge; bài này đi sâu ảnh — lớp nội dung thường nặng nhất trên landing page và shop online.',
          en: 'The hub’s basic CDN post explains edge cache; this one goes deeper on images — the heaviest layer on most landing pages and online shops.',
        },
      ],
      diagramSlug: 'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
    },
    {
      heading: {
        vi: 'Cache + resize: hai tầng làm việc cùng nhau',
        en: 'Cache + resize: two layers working together',
      },
      paragraphs: [
        {
          vi: 'Tầng 1 — CDN cache: sau lần đầu user (hoặc edge) lấy ảnh, bản sao có thể được giữ gần user cho request sau. Tốt cho ảnh tĩnh ít đổi: logo, icon, ảnh sản phẩm đã publish. Tầng 2 — resize/transform: Cloudflare Images hoặc image resizing qua URL cho phép yêu cầu `width=800,format=webp` thay vì ship file gốc 3000px cho mọi thiết bị.',
          en: 'Layer 1 — CDN cache: after the first fetch, a copy can stay near the user for later requests. Great for stable static images: logos, icons, published product shots. Layer 2 — resize/transform: Cloudflare Images or URL image resizing lets you request `width=800,format=webp` instead of shipping a 3000px original to every device.',
        },
        {
          vi: 'Kết hợp với R2 (object storage), nhiều team lưu ảnh gốc trên R2, phục vụ biến thể qua Workers hoặc Images — origin không phải resize mỗi request. Sơ đồ reference architecture “optimizing image delivery with Image Resizing and R2” trên docs Cloudflare minh họa luồng này; hub có diagram tương ứng.',
          en: 'Combined with R2 object storage, many teams store originals on R2 and serve variants via Workers or Images — the origin does not resize every request. The reference architecture diagram “optimizing image delivery with Image Resizing and R2” on Cloudflare docs illustrates this flow; the hub has the matching diagram.',
        },
        {
          vi: 'Lưu ý: cache mạnh không sửa ảnh design xấu hoặc file export sai từ Photoshop “không tối ưu”. Vẫn cần quy trình content: export đúng kích thước trước khi upload.',
          en: 'Note: aggressive cache does not fix bad design assets or unoptimized Photoshop exports. You still need a content workflow: export at the right size before upload.',
        },
      ],
    },
    {
      heading: {
        vi: 'Mobile và responsive: không gửi ảnh desktop cho mọi người',
        en: 'Mobile and responsive: do not send desktop images to everyone',
      },
      paragraphs: [
        {
          vi: 'Responsive images dùng `srcset` hoặc picture element: browser chọn file nhỏ trên mobile, lớn trên desktop. Cloudflare có thể phục vụ biến thể theo tham số URL hoặc header — giảm bytes thực sự đi qua mạng. Đây là “tối ưu tốc độ” có đo được: giảm MB per page view.',
          en: 'Responsive images use `srcset` or the picture element: the browser picks a small file on mobile, larger on desktop. Cloudflare can serve variants by URL params or headers — reducing bytes that actually cross the network. This is measurable speed work: fewer MB per page view.',
        },
        {
          vi: 'Lazy loading (tải ảnh khi sắp vào viewport) giúp trang “có vẻ” mở nhanh hơn — ảnh dưới fold không tranh băng thông với nội dung trên. Kết hợp lazy load + CDN + resize: pattern phổ biến trên blog và shop hiệu năng cao.',
          en: 'Lazy loading (load images near the viewport) makes the page feel faster opening — below-the-fold images do not fight bandwidth with above-the-fold content. Lazy load + CDN + resize is the common pattern on high-performance blogs and shops.',
        },
        {
          vi: 'Nếu bạn theo lộ trình Application Services, học CDN cache trước, thêm Images sau khi Lighthouse chỉ ảnh. Trang sản phẩm Images và Content Delivery trên hub là bước tiếp theo.',
          en: 'If you follow the Application Services track, learn CDN cache first, add Images when Lighthouse points at images. The Images product page and Content Delivery hub pages are the next step.',
        },
      ],
    },
    {
      heading: {
        vi: 'Checklist tuần đầu cho site ảnh nhiều',
        en: 'First-week checklist for image-heavy sites',
      },
      paragraphs: [
        {
          vi: 'Kiểm tra kích thước file ảnh hero và sản phẩm — mục tiêu dưới vài trăm KB cho ảnh lớn, nhỏ hơn cho icon. Bật proxy Cloudflare (đám mây cam) nếu chưa. Thử resize qua Images hoặc resizing URL cho một trang pilot. Chạy Lighthouse trước/sau. Purge cache sau khi thay ảnh quan trọng.',
          en: 'Check hero and product file sizes — aim under a few hundred KB for large images, smaller for icons. Enable Cloudflare proxy (orange cloud) if not already. Try resize via Images or resizing URL on one pilot page. Run Lighthouse before/after. Purge cache after changing important images.',
        },
        {
          vi: 'Câu hỏi tự kiểm tra: “Mobile có nhận cùng file 4MB như desktop không?” Nếu có, resize hoặc srcset là việc nên làm trước khi tối ưu CSS vi mô.',
          en: 'Self-check: “Does mobile get the same 4MB file as desktop?” If yes, resize or srcset should come before micro-optimizing CSS.',
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        vi: 'CDN cache có thay thế Cloudflare Images không?',
        en: 'Does CDN cache replace Cloudflare Images?',
      },
      answer: {
        vi: 'Không. Cache phân phối nhanh; Images/resize giảm kích thước và định dạng. Site ảnh nhiều thường cần cả hai.',
        en: 'No. Cache delivers fast; Images/resize shrinks size and format. Image-heavy sites usually need both.',
      },
    },
    {
      question: {
        vi: 'WebP và AVIF có bắt buộc không?',
        en: 'Are WebP and AVIF mandatory?',
      },
      answer: {
        vi: 'Không bắt buộc nhưng thường nhẹ hơn JPEG cho cùng chất lượng. Cloudflare có thể phục vụ format phù hợp browser; fallback JPEG vẫn hợp lý cho ảnh cũ.',
        en: 'Not mandatory but usually lighter than JPEG at similar quality. Cloudflare can serve formats browsers support; JPEG fallback is still fine for legacy assets.',
      },
    },
    {
      question: {
        vi: 'Ảnh user upload (UGC) tối ưu khác gì ảnh tĩnh?',
        en: 'How is user-uploaded (UGC) image tuning different from static images?',
      },
      answer: {
        vi: 'UGC cần pipeline: lưu gốc (thường R2), resize on demand, cache biến thể. Ảnh tĩnh do designer export có thể tối ưu một lần trước upload.',
        en: 'UGC needs a pipeline: store originals (often R2), resize on demand, cache variants. Static designer exports can be optimized once before upload.',
      },
    },
  ],
  sources: [
    {
      title: 'The Cloudflare Blog — Images topics',
      href: 'https://blog.cloudflare.com/tag/images/',
    },
    {
      title: 'The Cloudflare Blog — CDN topics',
      href: 'https://blog.cloudflare.com/tag/cdn/',
    },
    {
      title: 'Cloudflare Images (Cloudflare Docs)',
      href: 'https://developers.cloudflare.com/images/',
    },
  ],
  relatedTrack: 'application-services',
  relatedProductSlugs: ['images', 'cdn'],
  relatedPostSlugs: [
    'cdn-la-gi-cloudflare-cache-cho-nguoi-moi',
    'waf-bao-ve-website-cho-nguoi-moi',
    'developer-platform-xay-ung-dung-khong-can-quan-ly-server',
  ],
  hubLinks: [
    { href: '/content-delivery/', label: { vi: 'Content Delivery trên hub', en: 'Content Delivery on this hub' } },
    { href: '/products/images/', label: { vi: 'Images (trang sản phẩm)', en: 'Images (product page)' } },
    { href: '/products/cdn/', label: { vi: 'CDN (trang sản phẩm)', en: 'CDN (product page)' } },
    { href: '/tracks/application-services/', label: { vi: 'Lộ trình Application Services', en: 'Application Services track' } },
    { href: '/use-cases/accelerate-content-delivery/', label: { vi: 'Use case: tăng tốc nội dung', en: 'Use case: accelerate content delivery' } },
  ],
  diagramSlugs: [
    'optimizing-image-delivery-with-cloudflare-image-resizing-and-r2',
    'distributed-web-performance-architecture',
  ],
};
