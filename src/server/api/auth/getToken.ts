import type { ResponseTokenModel } from '../../../model/User';
import { getRefreshTokenApi } from './getRefreshToken';

type JwtPayload = { exp?: number; [key: string]: unknown };

const decodeJwt = (token: string): JwtPayload => {
  const parts = token.split('.');
  if (parts.length < 2) return {};
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      '=',
    );
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'));
  } catch {
    return {};
  }
};

const getToken = async ({
  access_token,
  refresh_token,
}: {
  access_token: string | undefined;
  refresh_token: string | undefined;
}): Promise<ResponseTokenModel> => {
  const accessToken = decodeJwt(access_token || '');
  const refreshToken = decodeJwt(refresh_token || '');

  // accessToken이 없는 경우 error를 return
  if (!accessToken?.exp) return { error: true };

  // accessToken이 있는 경우
  if (accessToken.exp) {
    // accessToken이 만료전인 경우 accessToken을 return
    if (accessToken.exp * 1000 > new Date().getTime()) {
      return access_token ? { data: access_token } : { error: true };
    }

    // refreshToken이 있는 경우
    if (refreshToken.exp) {
      // refreshToken이 만료전인 경우 refreshToken을 return
      if (refreshToken.exp * 1000 > new Date().getTime()) {
        return await getRefreshTokenApi(refresh_token);
      }

      return { error: true };
    }
  }

  return { error: true };
};

export default getToken;
