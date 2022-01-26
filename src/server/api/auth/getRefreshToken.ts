import urls from '../../../config/urls';
import cookie from 'cookie';

/** refresh token 발급 */
export const getRefreshTokenApi = async (cookies: string | undefined) => {
  if (cookies) {
    return await fetch(`${urls.baseUrl}/token/refresh`, {
      method: 'GET',
      headers: {
        Authorization: cookie.parse(cookies)['refresh-token'],
      },
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
      });
  }

  return { error: { message: 'refresh-token을 넣어주세요' } };
};
