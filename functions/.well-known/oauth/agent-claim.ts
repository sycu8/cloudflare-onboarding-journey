import { jsonResponse, readJson } from '../../../src/lib/server/json';

export const onRequestPost: PagesFunction = async ({ request }) => {
  let payload: { client_id?: string } = {};
  try {
    payload = (await readJson(request, 4096)) as { client_id?: string };
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!payload.client_id) {
    return jsonResponse({ ok: false, error: 'client_id_required' }, { status: 400 });
  }
  return jsonResponse({
    ok: true,
    client_id: payload.client_id,
    credential_type: 'bearer',
    message: 'Anonymous agent registered. Use hub.read without token; workshop.admin requires maintainer Bearer key.',
  });
};
