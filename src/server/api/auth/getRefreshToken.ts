import cookie from 'cookie';
import type { RequestHeaders } from '../../../model/Request';
import { Headers } from '../../../config/headers';

/** refresh token 발급 */
export const getRefreshTokenApi = async (cookies: string | undefined) => {
  if (!cookies) return { error: { message: 'refresh-token을 넣어주세요' } };

  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/token/refresh`, {
    method: 'POST',
    headers: {
      Authorization: cookie.parse(cookies)['refresh-token'],
      ...Headers(),
    } as RequestHeaders,
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
    });
};
