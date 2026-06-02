import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cfhub_delivery_checklist';

type Item = { vi: string; en: string };

export default function DeliveryChecklist(props: { items: Item[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => props.items.map(() => false));
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    setLang(document.documentElement.dataset.lang === 'en' ? 'en' : 'vi');
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (parsed.length === props.items.length) setChecked(parsed);
      }
    } catch {
      // ignore
    }
  }, [props.items.length]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // ignore
    }
  }, [checked]);

  const done = checked.filter(Boolean).length;
  const label = lang === 'en' ? 'Performance checklist' : 'Checklist hiệu năng';

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{label}</h3>
        <span className="text-muted text-xs">
          {done}/{props.items.length}
        </span>
      </div>
      <ul className="space-y-2">
        {props.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={checked[i]}
              onChange={() => setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))}
            />
            <span>{lang === 'en' ? item.en : item.vi}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
