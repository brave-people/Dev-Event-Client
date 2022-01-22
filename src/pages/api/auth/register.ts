import cookie from 'cookie';
import urls from '../../../config/urls';
import type { UserRegisterModel } from '../../../model/user';

export const registerUserApi = async (req: UserRegisterModel) => {
  return await fetch(`${urls.auth}/admin/v1/register/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
