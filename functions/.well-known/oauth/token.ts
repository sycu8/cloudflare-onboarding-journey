import { jsonResponse } from '../../../src/lib/server/json';

export const onRequestPost: PagesFunction = async () =>
  jsonResponse(
    {
      ok: false,
      error: 'not_supported',
      message:
        'This hub does not issue tokens. Use public GET APIs without auth, or Bearer WORKSHOP_ADMIN_KEY for admin routes. See /auth.md.',
    },
    { status: 501 },
  );
