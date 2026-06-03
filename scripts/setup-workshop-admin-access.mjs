/**
 * Configure Cloudflare Access for workshop admin UI + API.
 *
 * Creates self-hosted Access apps:
 *   - /admin   (admin UI + /admin/api/*)
 *   - /workshop/admin (legacy redirect)
 *
 * Requires CLOUDFLARE_API_TOKEN with Zero Trust (Access) edit permissions.
 *
 * Usage:
 *   node scripts/setup-workshop-admin-access.mjs [--dry-run]
 *   WORKSHOP_ADMIN_DOMAIN=onboarding-uat.orangecloud.vn node scripts/setup-workshop-admin-access.mjs
 */
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '4c15704ef706b9c8954cd6f9feb678d8';
const DOMAIN = process.env.WORKSHOP_ADMIN_DOMAIN || 'onboarding.orangecloud.vn';
const ADMIN_EMAIL = (process.env.WORKSHOP_ADMIN_EMAILS || 'sycu.lee@gmail.com').split(',')[0].trim();
const dryRun = process.argv.includes('--dry-run');

const APPS = [
  { path: '/admin', name: 'Hub Admin — Cloudflare Starter Hub' },
  { path: '/workshop/admin', name: 'Hub Admin (legacy redirect) — Cloudflare Starter Hub' },
];

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error('Set CLOUDFLARE_API_TOKEN with Account.Access: Edit (Zero Trust)');
  process.exit(1);
}

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(JSON.stringify(json.errors || json));
  }
  return json.result;
};

const listApps = () => api(`/accounts/${ACCOUNT_ID}/access/apps?per_page=50`);

const findApp = (apps, path) =>
  apps.find((a) => a.domain === DOMAIN && (a.path === path || a.path === `${path}/`));

async function ensureApp(apps, { path, name }) {
  let app = findApp(apps, path);

  if (!app) {
    const body = {
      name,
      domain: DOMAIN,
      type: 'self_hosted',
      session_duration: '24h',
      path,
      auto_redirect_to_identity: true,
    };
    if (dryRun) {
      console.log('would create app', body);
      return null;
    }
    app = await api(`/accounts/${ACCOUNT_ID}/access/apps`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    console.log(`✓ created Access app ${path}`, app.id);
  } else {
    console.log(`✓ Access app exists ${path}`, app.id);
  }

  return app;
}

async function ensureAllowPolicy(appId) {
  const policies = await api(`/accounts/${ACCOUNT_ID}/access/apps/${appId}/policies`);
  const allow = policies.find(
    (p) => p.decision === 'allow' && p.include?.some((i) => i.email?.email === ADMIN_EMAIL),
  );

  if (!allow) {
    const policy = {
      name: `Allow ${ADMIN_EMAIL}`,
      decision: 'allow',
      include: [{ email: { email: ADMIN_EMAIL } }],
      precedence: 1,
    };
    if (dryRun) {
      console.log('would create policy', policy);
    } else {
      await api(`/accounts/${ACCOUNT_ID}/access/apps/${appId}/policies`, {
        method: 'POST',
        body: JSON.stringify(policy),
      });
      console.log('✓ created allow policy for', ADMIN_EMAIL);
    }
  } else {
    console.log('✓ allow policy exists', allow.id);
  }
}

async function main() {
  console.log(`Domain: ${DOMAIN}`);
  console.log(`Allow email: ${ADMIN_EMAIL}`);
  console.log(`Paths: ${APPS.map((a) => a.path).join(', ')}`);

  const apps = await listApps();

  for (const spec of APPS) {
    console.log(`\n--- ${spec.path} ---`);
    const app = await ensureApp(apps, spec);
    if (app?.id) {
      await ensureAllowPolicy(app.id);
    }
  }

  if (dryRun) {
    console.log('\n(dry-run complete)');
    return;
  }

  console.log('\nSet Pages env: WORKSHOP_ADMIN_EMAILS=' + ADMIN_EMAIL);
  console.log('Test UI: https://' + DOMAIN + '/admin/');
  console.log('Test API auth: https://' + DOMAIN + '/admin/api/me (after Access login)');
}

main().catch((e) => {
  console.error(e.message);
  console.error('\nManual setup: docs/WORKSHOP-ADMIN-ACCESS.md');
  process.exit(1);
});
