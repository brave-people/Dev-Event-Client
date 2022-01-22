import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { getRefreshTokenApi } from './getRefreshToken';

const getToken = async (cookies: string | undefined) => {
  const parsedCookies = cookies && cookie.parse(cookies);
  const accessToken = parsedCookies
    ? (jwt.decode(parsedCookies['access_token']) as jwt.JwtPayload)
    : {};
  const refreshToken = parsedCookies
    ? (jwt.decode(parsedCookies['refresh_token']) as jwt.JwtPayload)
    : {};

  // accessToken이 없는 경우 error를 return
  if (!accessToken.exp) return { error: true };

  // accessToken이 있는 경우
  if (accessToken.exp) {
    // accessToken이 만료전인 경우 accessToken을 return
    if (accessToken.exp * 1000 > new Date().getTime()) {
      return { data: parsedCookies };
    }

    // refreshToken이 있는 경우
    if (refreshToken.exp) {
      // refreshToken이 만료전인 경우 refreshToken을 return
      if (refreshToken.exp * 1000 > new Date().getTime()) {
        const data = await getRefreshTokenApi(cookies);

        if (data.error) {
          console.error(data.error.message);
          return null;
        }

        return { data };
      }

      return { error: { message: true } };
    }
  }
};

export default getToken;
