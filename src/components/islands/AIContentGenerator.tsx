import { useEffect, useMemo, useState } from 'react';
import { getStoredLanguage } from '../../i18n/storage';

type ApiResponse = { result?: any; error?: string };

function pickText(obj: any): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  // Common Workers AI shapes: { response: "..." } or OpenAI-like { choices: [...] }
  if (typeof obj.response === 'string') return obj.response;
  const choice = obj.choices?.[0];
  if (typeof choice?.message?.content === 'string') return choice.message.content;
  if (typeof choice?.text === 'string') return choice.text;
  return JSON.stringify(obj, null, 2);
}

export default function AIContentGenerator() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    setLang(getStoredLanguage());
  }, []);

  const ui = useMemo(() => {
    return lang === 'en'
      ? {
          title: 'Generate a beginner-friendly explanation (Workers AI)',
          placeholder: 'Example: "What is WAF?" or "How to secure an API?"',
          button: 'Generate',
          note:
            'This uses Workers AI via a Pages Function. In v1, it does not store anything (no database).',
        }
      : {
          title: 'Tạo nội dung giải thích cho người mới (Workers AI)',
          placeholder: 'Ví dụ: "WAF là gì?" hoặc "Bảo vệ API như thế nào?"',
          button: 'Tạo nội dung',
          note:
            'Phần này dùng Workers AI qua Pages Function. Ở v1 không lưu dữ liệu (không database).',
        };
  }, [lang]);

  async function onGenerate() {
    setError(null);
    setOutput('');
    const p = prompt.trim();
    if (!p) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: p, lang }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setOutput(pickText(data.result));
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="text-lg font-semibold">{ui.title}</div>
      <p className="text-muted mt-2 text-sm">{ui.note}</p>

      <div className="mt-4 flex flex-col gap-3">
        <label className="text-sm font-medium">
          <span className="sr-only">Prompt</span>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={ui.placeholder}
            className="cf-input"
          />
        </label>
        <button
          type="button"
          className="btn btn-primary w-fit"
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (lang === 'en' ? 'Generating…' : 'Đang tạo…') : ui.button}
        </button>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        ) : null}

        {output ? (
          <pre
            className="whitespace-pre-wrap rounded-xl border p-4 text-sm"
            style={{ borderColor: 'var(--cf-border)', background: 'var(--cf-surface)', color: 'var(--cf-text)' }}
          >
            {output}
          </pre>
        ) : null}
      </div>
    </div>
  );
}

