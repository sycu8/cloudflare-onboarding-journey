type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({ page, totalPages, onPageChange, className = '' }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showEllipsis = totalPages > 7;
  const visible = showEllipsis
    ? pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    : pages;

  return (
    <nav
      className={`mt-6 flex flex-wrap items-center justify-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      <button
        type="button"
        className="btn btn-secondary px-3 py-2 text-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <span className="lang-vi">← Trước</span>
        <span className="lang-en">← Prev</span>
      </button>

      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const gap = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {gap ? <span className="text-muted px-1">…</span> : null}
            <button
              type="button"
              className={`btn min-w-[2.5rem] px-3 py-2 text-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        className="btn btn-secondary px-3 py-2 text-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <span className="lang-vi">Sau →</span>
        <span className="lang-en">Next →</span>
      </button>
    </nav>
  );
}
