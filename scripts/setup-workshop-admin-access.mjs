/**
 * Configure Cloudflare Access for workshop admin UI + API via the `cf` CLI.
 *
 * Creates self-hosted Access apps:
 *   - /admin   (admin UI + /admin/api/*)
 *   - /workshop/admin (legacy redirect)
 *
 * Auth: CLOUDFLARE_API_TOKEN (Zero Trust / Access edit) or `cf auth login`.
 *
 * Usage:
 *   node scripts/setup-workshop-admin-access.mjs [--dry-run]
 *   WORKSHOP_ADMIN_DOMAIN=onboarding-uat.orangecloud.vn node scripts/setup-workshop-admin-access.mjs
 */
import { cf, cfBody, ensureCfAuth } from './lib/cf.mjs';

const DOMAIN = process.env.WORKSHOP_ADMIN_DOMAIN || 'onboarding.orangecloud.vn';
const ADMIN_EMAIL = (process.env.WORKSHOP_ADMIN_EMAILS || 'sycu.lee@gmail.com').split(',')[0].trim();
const dryRun = process.argv.includes('--dry-run');

const APPS = [
  { path: '/admin', name: 'Hub Admin — Cloudflare Starter Hub' },
  { path: '/workshop/admin', name: 'Hub Admin (legacy redirect) — Cloudflare Starter Hub' },
];

const listApps = () =>
  /** @type {PromiseLike<never> | Array<Record<string, unknown>>} */ (
    cf(['zero-trust', 'access', 'applications', 'list', '--per-page', '50'])
  );

const pathMatches = (value, path) => {
  const v = String(value || '').replace(/\/+$/, '');
  const want = `${DOMAIN}${path}`.replace(/\/+$/, '');
  const wantStar = `${want}/*`;
  return v === want || v === wantStar || v.endsWith(path) || v.endsWith(`${path}/*`);
};

const findApp = (apps, path) =>
  apps.find((a) => {
    const domain = String(a.domain || '');
    const appPath = String(a.path || '');
    if (domain === DOMAIN && (appPath === path || appPath === `${path}/`)) return true;
    if (pathMatches(domain, path)) return true;
    const hosts = Array.isArray(a.self_hosted_domains) ? a.self_hosted_domains : [];
    return hosts.some((h) => pathMatches(h, path));
  });

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
    app = /** @type {Record<string, unknown>} */ (
      cfBody(['zero-trust', 'access', 'applications', 'create'], body)
    );
    console.log(`✓ created Access app ${path}`, app.id);
  } else {
    console.log(`✓ Access app exists ${path}`, app.id);
  }

  return app;
}

function ensureAllowPolicy(appId) {
  const policies = /** @type {Array<Record<string, unknown>>} */ (
    cf(['zero-trust', 'access', 'applications', 'policies', 'list', '--app-id', String(appId)])
  );
  const list = Array.isArray(policies) ? policies : [];
  const allow = list.find(
    (p) =>
      p.decision === 'allow' &&
      Array.isArray(p.include) &&
      p.include.some((i) => i?.email?.email === ADMIN_EMAIL),
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
      cfBody(['zero-trust', 'access', 'applications', 'policies', 'create', String(appId)], policy);
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

  ensureCfAuth();

  const apps = /** @type {Array<Record<string, unknown>>} */ (listApps());
  const list = Array.isArray(apps) ? apps : [];

  for (const spec of APPS) {
    console.log(`\n--- ${spec.path} ---`);
    const app = await ensureApp(list, spec);
    if (app?.id) {
      ensureAllowPolicy(app.id);
    }
  }

  console.log('\nDone. Open https://' + DOMAIN + '/admin/ after Access policies propagate.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
