import { jsonResponse } from '../../../src/lib/server/json';

export const onRequestGet: PagesFunction = async () =>
  jsonResponse(
    {
      ok: false,
      error: 'not_supported',
      message: 'Interactive OAuth is not enabled. See /.well-known/oauth-authorization-server and /auth.md.',
    },
    { status: 501 },
  );
