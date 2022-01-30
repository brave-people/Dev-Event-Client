import cookie from 'cookie';
import type { UserRegisterModel } from '../../../model/User';

export const registerUserApi = async (req: UserRegisterModel) => {
  return await fetch(`${process.env.ADMIN_URL}/register/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
