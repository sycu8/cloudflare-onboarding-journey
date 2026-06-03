/**
 * Generates agent discovery artifacts under public/ from PUBLIC_SITE_URL.
 * Run before `astro build` (see package.json).
 */
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const origin = (process.env.PUBLIC_SITE_URL || 'https://onboarding.orangecloud.vn').replace(/\/$/, '');

const skillsSrc = join(root, 'agent-discovery', 'skills');
const skillsOut = join(root, 'public', '.well-known', 'agent-skills');
const wellKnown = join(root, 'public', '.well-known');

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n', 'utf8');
}

function sha256File(path) {
  const buf = readFileSync(path);
  return `sha256:${createHash('sha256').update(buf).digest('hex')}`;
}

mkdirSync(skillsOut, { recursive: true });
for (const name of ['navigate-learning-hub.md', 'hub-public-api.md', 'hub-agent-auth.md']) {
  cpSync(join(skillsSrc, name), join(skillsOut, name));
}

const skillEntries = ['navigate-learning-hub.md', 'hub-public-api.md', 'hub-agent-auth.md'].map((file) => {
  const full = join(skillsOut, file);
  const base = file.replace(/\.md$/, '');
  return {
    name: base,
    type: 'skill-md',
    description:
      base === 'navigate-learning-hub'
        ? 'Find tracks, use cases, products, and glossary terms on the Cloudflare Starter Hub.'
        : base === 'hub-public-api'
          ? 'Call read-only Hub APIs (site config, workshop events) with documented rate limits.'
          : 'Register anonymous agent identity and use Bearer credentials for workshop admin APIs.',
    url: `${origin}/.well-known/agent-skills/${file}`,
    digest: sha256File(full),
  };
});

write(join(wellKnown, 'agent-skills', 'index.json'), {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills: skillEntries,
});

write(join(wellKnown, 'openapi.json'), {
  openapi: '3.1.0',
  info: {
    title: 'Cloudflare Starter Hub API',
    version: '1.0.0',
    description:
      'Public read APIs and form submission endpoints for the Cloudflare Starter Hub learning site.',
  },
  servers: [{ url: `${origin}/api` }],
  paths: {
    '/site-config': {
      get: {
        operationId: 'getSiteConfig',
        summary: 'Site feature flags and announcement banner',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    workshopEnabled: { type: 'boolean' },
                    resourceDownloadsEnabled: { type: 'boolean' },
                    announcementBanner: { nullable: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/workshop-events': {
      get: {
        operationId: 'listWorkshopEvents',
        summary: 'List published workshop events',
        responses: { '200': { description: 'OK' } },
      },
      post: {
        operationId: 'createWorkshopEvent',
        summary: 'Create event (requires Bearer admin key)',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Created' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/workshop-signup': {
      post: {
        operationId: 'workshopSignup',
        summary: 'Register for a workshop (Turnstile + rate limit)',
        responses: { '200': { description: 'OK' }, '400': { description: 'Validation error' } },
      },
    },
    '/feedback': {
      post: {
        operationId: 'submitFeedback',
        summary: 'Submit site feedback',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/quiz-submission': {
      post: {
        operationId: 'submitQuiz',
        summary: 'Submit beginner quiz answers',
        responses: { '200': { description: 'OK' } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', description: 'WORKSHOP_ADMIN_KEY for admin writes' },
    },
  },
});

write(join(wellKnown, 'api-catalog'), {
  linkset: [
    {
      anchor: `${origin}/api`,
      'service-desc': [
        {
          href: `${origin}/.well-known/openapi.json`,
          type: 'application/vnd.oai.openapi+json;version=3.1',
        },
      ],
      'service-doc': [{ href: `${origin}/docs/api/`, type: 'text/html' }],
      status: [{ href: `${origin}/api/site-config`, type: 'application/json' }],
    },
  ],
});

write(join(wellKnown, 'oauth-authorization-server'), {
  issuer: origin,
  authorization_endpoint: `${origin}/.well-known/oauth/authorize`,
  token_endpoint: `${origin}/.well-known/oauth/token`,
  jwks_uri: `${origin}/.well-known/jwks.json`,
  registration_endpoint: `${origin}/.well-known/oauth/register`,
  grant_types_supported: ['client_credentials', 'urn:ietf:params:oauth:grant-type:token-exchange'],
  response_types_supported: ['token'],
  token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
  scopes_supported: ['hub.read', 'workshop.admin'],
  agent_auth: {
    skill: `${origin}/auth.md`,
    register_uri: `${origin}/.well-known/oauth/register`,
    identity_types_supported: ['anonymous'],
    anonymous: {
      credential_types_supported: ['bearer'],
      claim_uri: `${origin}/.well-known/oauth/agent-claim`,
    },
  },
});

write(join(wellKnown, 'openid-configuration'), {
  issuer: origin,
  authorization_endpoint: `${origin}/.well-known/oauth/authorize`,
  token_endpoint: `${origin}/.well-known/oauth/token`,
  jwks_uri: `${origin}/.well-known/jwks.json`,
  registration_endpoint: `${origin}/.well-known/oauth/register`,
  response_types_supported: ['token'],
  grant_types_supported: ['client_credentials'],
  subject_types_supported: ['public'],
  id_token_signing_alg_values_supported: ['none'],
  scopes_supported: ['openid', 'hub.read', 'workshop.admin'],
});

write(join(wellKnown, 'oauth-protected-resource'), {
  resource: `${origin}/api`,
  authorization_servers: [origin],
  scopes_supported: ['hub.read', 'workshop.admin'],
  bearer_methods_supported: ['header'],
  resource_documentation: `${origin}/docs/api/`,
});

write(join(wellKnown, 'jwks.json'), { keys: [] });

write(join(wellKnown, 'mcp', 'server-card.json'), {
  serverInfo: { name: 'Cloudflare Starter Hub', version: '1.0.0' },
  transport: { type: 'streamable-http', endpoint: `${origin}/api/mcp` },
  capabilities: { tools: true, resources: false, prompts: false },
  documentation: `${origin}/docs/api/`,
});

write(join(wellKnown, 'agent-card.json'), {
  name: 'Cloudflare Starter Hub',
  description: 'Bilingual learning hub for Cloudflare Application Services, Developer Platform, and Cloudflare One.',
  version: '1.0.0',
  documentationUrl: `${origin}/docs/api/`,
  supportedInterfaces: [
    {
      url: `${origin}/api/mcp`,
      protocolBinding: 'HTTP+JSON',
      protocolVersion: '1.0',
    },
  ],
  capabilities: {},
  defaultInputModes: ['text/plain'],
  defaultOutputModes: ['text/plain'],
  skills: [
    {
      id: 'navigate-learning-hub',
      name: 'Navigate learning hub',
      description: 'List tracks, use cases, products, and official resource links.',
      tags: ['cloudflare', 'education', 'navigation'],
    },
    {
      id: 'hub-public-api',
      name: 'Hub public API',
      description: 'Read site config and workshop events via documented REST endpoints.',
      tags: ['cloudflare', 'api'],
    },
  ],
});

write(
  join(root, 'public', 'auth.md'),
  `# auth.md — Cloudflare Starter Hub

Agent and automation clients can use this hub as a **read-mostly** learning site. Write APIs are limited and documented below.

## Audience

- **Read-only agents**: \`GET /api/site-config\`, \`GET /api/workshop-events\` — no registration required.
- **Admin automation**: workshop event management requires a Bearer token (\`WORKSHOP_ADMIN_KEY\`) issued out-of-band to maintainers.

## Registration

**agent_auth** (machine-readable): register at \`${origin}/.well-known/oauth/register\`, claim at \`${origin}/.well-known/oauth/agent-claim\`.

Anonymous agent identity (no PII):

1. \`POST ${origin}/.well-known/oauth/register\` with body \`{"client_name":"your-agent"}\` → returns \`client_id\`.
2. \`POST ${origin}/.well-known/oauth/agent-claim\` with \`{"client_id":"<client_id>"}\` → anonymous bearer context for \`hub.read\`.
3. Protected resource metadata: [\`/.well-known/oauth-protected-resource\`](${origin}/.well-known/oauth-protected-resource).
4. Authorization server (includes \`agent_auth\` block): [\`/.well-known/oauth-authorization-server\`](${origin}/.well-known/oauth-authorization-server).

Supported identity: \`anonymous\`. Credential type: \`bearer\` (read-only hub APIs without token; \`workshop.admin\` requires maintainer key).

## Credentials

| Scope | Method | Notes |
|-------|--------|-------|
| \`hub.read\` | None | Public GET endpoints |
| \`workshop.admin\` | \`Authorization: Bearer <WORKSHOP_ADMIN_KEY>\` | Maintainer-only; request from site operators |

## Discovery

- API catalog: [\`/.well-known/api-catalog\`](${origin}/.well-known/api-catalog)
- OpenAPI: [\`/.well-known/openapi.json\`](${origin}/.well-known/openapi.json)
- Agent skills: [\`/.well-known/agent-skills/index.json\`](${origin}/.well-known/agent-skills/index.json)
- MCP card: [\`/.well-known/mcp/server-card.json\`](${origin}/.well-known/mcp/server-card.json)
`,
);

write(
  join(root, 'public', 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /workshop/admin/
Content-Signal: ai-train=no, search=yes, ai-input=no

Sitemap: ${origin}/sitemap-index.xml
`,
);

console.log(`✓ Agent discovery artifacts for ${origin}`);
