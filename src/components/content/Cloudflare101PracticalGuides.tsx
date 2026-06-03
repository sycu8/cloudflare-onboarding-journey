import { useState } from 'react';
import type { PracticalGuideSection, WafBestPractice } from '../../data/cf101PracticalGuides';
import { docsUrl } from '../../data/cloudflare101';

type Props = {
  configSections: PracticalGuideSection[];
  wafPractices: WafBestPractice[];
};

export default function Cloudflare101PracticalGuides({ configSections, wafPractices }: Props) {
  const [openConfig, setOpenConfig] = useState<string | null>(configSections[0]?.id ?? null);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-lg font-semibold">
          <span className="lang-vi">Hướng dẫn cấu hình cơ bản</span>
          <span className="lang-en">Basic configuration guide</span>
        </h3>
        <p className="text-muted mb-4 max-w-3xl text-sm leading-relaxed">
          <span className="lang-vi">
            Tóm tắt lab DNS, TLS, WAF, Bot, Cache, Load Balancer và Transform Rules — làm theo từng bước trên
            Dashboard.
          </span>
          <span className="lang-en">
            Lab summaries for DNS, TLS, WAF, Bot, Cache, Load Balancer, and Transform Rules — follow along in the
            Dashboard.
          </span>
        </p>
        <div className="space-y-2">
          {configSections.map((section) => {
            const isOpen = openConfig === section.id;
            return (
              <div key={section.id} className="card overflow-hidden p-0">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                  onClick={() => setOpenConfig(isOpen ? null : section.id)}
                  aria-expanded={isOpen}
                >
                  <span>
                    <span className="block font-semibold">
                      <span className="lang-vi">{section.title.vi}</span>
                      <span className="lang-en">{section.title.en}</span>
                    </span>
                    <span className="text-muted mt-1 block text-sm">
                      <span className="lang-vi">{section.summary.vi}</span>
                      <span className="lang-en">{section.summary.en}</span>
                    </span>
                  </span>
                  <span className="text-muted shrink-0 text-lg" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen ? (
                  <div className="border-t border-[var(--cf-border)] px-4 pb-4 pt-2">
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
                      {section.bullets.map((b, i) => (
                        <li key={i}>
                          <span className="lang-vi">{b.text.vi}</span>
                          <span className="lang-en">{b.text.en}</span>
                        </li>
                      ))}
                    </ul>
                    {section.docsPath ? (
                      <a
                        className="link mt-3 inline-block text-xs"
                        href={docsUrl(section.docsPath)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Docs →
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">
          <span className="lang-vi">WAF — best practice rules</span>
          <span className="lang-en">WAF — best practice rules</span>
        </h3>
        <p className="text-muted mb-4 max-w-3xl text-sm">
          <span className="lang-vi">
            Gợi ý custom rule phổ biến. Gói Free/Pro giới hạn số rule — ưu tiên rule quan trọng nhất.
          </span>
          <span className="lang-en">
            Common custom rule patterns. Free/Pro plans limit rule count — prioritize what matters most.
          </span>
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {wafPractices.map((p) => (
            <li key={p.id} className="card p-4">
              <h4 className="font-semibold">
                <span className="lang-vi">{p.title.vi}</span>
                <span className="lang-en">{p.title.en}</span>
              </h4>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                <span className="lang-vi">{p.summary.vi}</span>
                <span className="lang-en">{p.summary.en}</span>
              </p>
              {p.note ? (
                <p className="text-muted mt-2 text-xs">
                  <span className="lang-vi">{p.note.vi}</span>
                  <span className="lang-en">{p.note.en}</span>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <a className="link mt-4 inline-block text-sm" href={docsUrl('/waf/custom-rules/')} target="_blank" rel="noopener noreferrer">
          <span className="lang-vi">Custom rules — Cloudflare Docs →</span>
          <span className="lang-en">Custom rules — Cloudflare Docs →</span>
        </a>
      </div>
    </div>
  );
}
