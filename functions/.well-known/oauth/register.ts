import { jsonResponse } from '../../../src/lib/server/json';
import { randomId } from '../../../src/lib/server/crypto';

/** Anonymous OAuth client registration stub for agent discovery (RFC 7591-style). */
export const onRequestPost: PagesFunction = async ({ request }) => {
  let body: { client_name?: string } = {};
  try {
    body = (await request.json()) as { client_name?: string };
  } catch {
    /* empty body OK */
  }
  return jsonResponse(
    {
      client_id: randomId('agent'),
      client_name: body.client_name || 'anonymous-agent',
      grant_types: ['client_credentials'],
      token_endpoint_auth_method: 'none',
      client_id_issued_at: Math.floor(Date.now() / 1000),
    },
    { status: 201 },
  );
};
