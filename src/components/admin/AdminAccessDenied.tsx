type Props = {
  authInfo: {
    accessEmail?: string | null;
    hasAccessHeader?: boolean;
    hasAccessIdentity?: boolean;
    allowlist?: string[];
  } | null;
  adminEmail: string | null;
  error: string | null;
};

export default function AdminAccessDenied({ authInfo, adminEmail, error }: Props) {
  const allowlist = authInfo?.allowlist?.join(', ') || 'sycu.lee@gmail.com';
  const accessEmail = authInfo?.accessEmail ?? adminEmail;
  const hasIdentity = authInfo?.hasAccessIdentity ?? authInfo?.hasAccessHeader;
  const missingAccessIdentity = hasIdentity === false;

  return (
    <div className="admin-access-denied card mx-auto max-w-lg space-y-3">
      <h2 className="text-lg font-semibold">
        <span className="lang-vi">Truy cập bị từ chối</span>
        <span className="lang-en">Access denied</span>
      </h2>
      {missingAccessIdentity ? (
        <p className="text-muted text-sm">
          <span className="lang-vi">
            Trang admin đã qua Cloudflare Access nhưng request API không có header xác thực. Kiểm tra Access application
            bảo vệ path <code className="text-xs">/admin</code> (bao gồm <code className="text-xs">/admin/api/*</code>).
          </span>
          <span className="lang-en">
            Admin UI passed Cloudflare Access but API requests lack the identity header. Ensure an Access app protects{' '}
            <code className="text-xs">/admin</code> (includes <code className="text-xs">/admin/api/*</code>).
          </span>
        </p>
      ) : accessEmail ? (
        <p className="text-muted text-sm">
          <span className="lang-vi">
            Email Access: <strong>{accessEmail}</strong> — không nằm trong danh sách ({allowlist}).
          </span>
          <span className="lang-en">
            Access email: <strong>{accessEmail}</strong> — not in allowlist ({allowlist}).
          </span>
        </p>
      ) : (
        <p className="text-muted text-sm">
          <span className="lang-vi">Chỉ email được phép ({allowlist}) mới truy cập khu vực admin.</span>
          <span className="lang-en">Only allowlisted emails ({allowlist}) may access the admin area.</span>
        </p>
      )}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
