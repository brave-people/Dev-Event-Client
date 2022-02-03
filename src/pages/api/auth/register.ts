import cookie from 'cookie';
import type { UserRegisterModel } from '../../../model/User';
import Headers from '../../../config/headers';

export const registerUserApi = async (req: UserRegisterModel) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/register/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers,
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
