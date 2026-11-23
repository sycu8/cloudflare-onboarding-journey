/** Real model adapters (prompt files + chatJson). Not used by offline tests. */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { chatJson, llmConfig } from '../llm.mjs';
import { failingClaimBrief } from './ground.mjs';
import { postWordCount } from './checks.mjs';
import { excerptAround } from './review.mjs';
import { toPromptPassages } from './sources.mjs';

/** @param {string} root */
export function createModels(root, env = process.env) {
  const prompt = (name) => readFileSync(path.join(root, 'scripts/prompts', `${name}.md`), 'utf8');
  const cfg = llmConfig(env);
  const diagrams = JSON.parse(readFileSync(path.join(root, 'src/data/referenceDiagrams.data.json'), 'utf8')).map((d) => d.slug);
  const sourcesBlock = (sources) =>
    Object.entries(sources)
      .map(([url, text]) => `### SOURCE ${url}\n${toPromptPassages(text)}`)
      .join('\n\n');
  return {
    name: cfg.model || null,
    configured: cfg.configured,
    async generate({ item, sources, existingSlugs = [] }) {
      return chatJson(
        {
          system: prompt('blog-generate'),
          user: [
            `SCHEDULE ITEM:\n${JSON.stringify(item, null, 2)}`,
            `ALLOWED diagramSlugs: ${diagrams.join(', ')}`,
            `ALLOWED relatedPostSlugs: ${existingSlugs.join(', ')}`,
            `SOURCE EXCERPTS:\n${sourcesBlock(sources)}`,
          ].join('\n\n'),
        },
        { env, maxOutputTokens: 16384 },
      );
    },
    async review({ post, ledger, sources }) {
      const excerpts = Object.fromEntries(
        (ledger?.claims || []).map((c) => [`${c.id} ${c.sourceUrl}`, excerptAround(sources[c.sourceUrl] || '', c.quote)]),
      );
      return chatJson(
        {
          system: prompt('blog-review'),
          user: `POST:\n${JSON.stringify(post, null, 2)}\n\nLEDGER:\n${JSON.stringify(ledger, null, 2)}\n\nSOURCE TEXT AROUND EACH QUOTE:\n${JSON.stringify(excerpts, null, 2)}`,
        },
        { env, temperature: 0 },
      );
    },
    async fix({ post, ledger, report, sources, repair = false }) {
      const findings = report.findings.filter((f) => f.severity !== 'minor' || report.verdict === 'fail');
      const brief = failingClaimBrief(report, ledger, sources);
      const words = `Current length: vi=${postWordCount(post, 'vi')} words, en=${postWordCount(post, 'en')} words. Each language needs at least 450.`;
      const shape = repair
        ? '\n\nYour previous reply was rejected. Return one JSON object shaped exactly {"post":{...},"claims":[...]} and nothing else.'
        : '';
      return chatJson(
        {
          system: prompt('blog-fix'),
          user: `POST:\n${JSON.stringify(post, null, 2)}\n\nLEDGER:\n${JSON.stringify(ledger, null, 2)}\n\n${words}\n\nFAILING CLAIMS:\n${brief || '(none)'}\n\nFINDINGS:\n${JSON.stringify(findings, null, 2)}\n\nSOURCE PASSAGES (copy quotes from these sentences only):\n${sourcesBlock(sources)}${shape}`,
        },
        { env, maxOutputTokens: 16384 },
      );
    },
  };
}
