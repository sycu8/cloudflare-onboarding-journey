import { jsonResponse } from '../../src/lib/server/json';

/** MCP transport placeholder — discovery card at /.well-known/mcp/server-card.json */
export const onRequestGet: PagesFunction = async () =>
  jsonResponse({
    ok: false,
    error: 'mcp_not_deployed',
    message: 'Streamable HTTP MCP is not enabled on this static learning hub. Use WebMCP tools on the homepage or REST APIs in /.well-known/openapi.json.',
    serverCard: '/.well-known/mcp/server-card.json',
  }, { status: 501 });

export const onRequestPost: PagesFunction = onRequestGet;
