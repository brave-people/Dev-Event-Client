import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { UserRegisterModel } from '../../model/User';

export const registerUserApi = async (req: UserRegisterModel) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/register/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
