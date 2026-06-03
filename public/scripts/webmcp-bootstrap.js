/**
 * WebMCP — register hub tools on homepage load (provideContext + registerTool).
 * https://webmachinelearning.github.io/webmcp/
 */
(function () {
  'use strict';

  function toolResult(data) {
    return {
      content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data) }],
    };
  }

  function buildTools(origin) {
    return [
      {
        name: 'list_learning_tracks',
        description: 'List Cloudflare Starter Hub learning tracks with URLs.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        execute: function () {
          return Promise.resolve(
            toolResult({
              tracks: [
                { id: 'application-services', url: origin + '/tracks/application-services/' },
                { id: 'developer-platform', url: origin + '/tracks/developer-platform/' },
                { id: 'cloudflare-one', url: origin + '/tracks/cloudflare-one/' },
              ],
            }),
          );
        },
      },
      {
        name: 'get_site_config',
        description: 'Fetch GET /api/site-config feature flags and announcement banner.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        execute: function () {
          return fetch(origin + '/api/site-config').then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json().then(toolResult);
          });
        },
      },
      {
        name: 'search_use_cases',
        description: 'List use-case scenario URLs (protect website, API, AI, Zero Trust, etc.).',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Optional keyword filter' },
          },
          additionalProperties: false,
        },
        execute: function (input) {
          var slugs = [
            'protect-website',
            'secure-api',
            'defend-ddos-attacks',
            'accelerate-content-delivery',
            'ecommerce-security-performance',
            'media-streaming-delivery',
            'build-serverless-app',
            'deploy-static-site',
            'build-ai-applications',
            'build-saas-platform',
            'replace-vpn',
            'company-wide-security',
            'secure-remote-users',
            'secure-saas-access',
          ];
          var q = (input && input.query ? String(input.query) : '').toLowerCase().trim();
          var filtered = q ? slugs.filter(function (s) { return s.indexOf(q) >= 0; }) : slugs;
          return Promise.resolve(
            toolResult({
              index: origin + '/use-cases/',
              useCases: filtered.map(function (slug) {
                return { slug: slug, url: origin + '/use-cases/' + slug + '/' };
              }),
            }),
          );
        },
      },
    ];
  }

  function publishTools(origin) {
    var mc = navigator.modelContext;
    if (!mc) return false;

    var tools = buildTools(origin);

    if (typeof mc.provideContext === 'function') {
      mc.provideContext({ tools: tools });
      return true;
    }

    if (typeof mc.registerTool === 'function') {
      var controller = new AbortController();
      for (var i = 0; i < tools.length; i++) {
        mc.registerTool(tools[i], { signal: controller.signal });
      }
      window.addEventListener(
        'pagehide',
        function () {
          controller.abort();
        },
        { once: true },
      );
      return true;
    }

    return false;
  }

  function boot() {
    publishTools(window.location.origin);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
