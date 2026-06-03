import { jsonResponse } from '../../../src/lib/server/json';
import { hasAccessIdentity, parseAdminEmails, verifyWorkshopAdmin, workshopAdminEmail } from '../../../src/lib/server/adminAuth';

type Env = {
  WORKSHOP_ADMIN_KEY?: string;
  WORKSHOP_ADMIN_EMAILS?: string;
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const email = workshopAdminEmail(request)?.toLowerCase() ?? null;
  const authorized = verifyWorkshopAdmin(request, env);
  const hasAccessHeader = hasAccessIdentity(request);

  return jsonResponse(
    {
      ok: true,
      authorized,
      email: authorized ? email : null,
      accessEmail: email,
      hasAccessIdentity: hasAccessHeader,
      hasAccessHeader,
      allowlist: parseAdminEmails(env.WORKSHOP_ADMIN_EMAILS),
    },
    { headers: { 'cache-control': 'private, no-store' } },
  );
};
