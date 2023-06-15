import { cookies } from 'next/headers';
import type { ResponseTokenModel } from '../model/User';
import getToken from '../server/api/auth/getToken';

const updateToken = async (): Promise<ResponseTokenModel> => {
  return await getToken({
    access_token: String(cookies().get('access_token')?.value),
    refresh_token: String(cookies().get('refresh_token')?.value),
  });
};

export default updateToken;
