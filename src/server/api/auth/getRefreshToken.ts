import urls from '../../../config/urls';
import cookie from 'cookie';

/** refresh token 발급 */
export const getRefreshTokenApi = async (cookies: string | undefined) => {
  if (cookies) {
    return await fetch(`${urls.auth}/admin/v1/token/refresh`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookie.parse(cookies)['refresh-token']}`,
      },
    }).then((res) => res.json());
  }

  return { error: { message: 'refresh-token을 넣어주세요' } };
};
