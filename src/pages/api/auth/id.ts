import cookie from 'cookie';
import type { UserIdModel } from '../../../model/User';

/** 중복 아이디 체크 */
export const registerIdApi = async (req: UserIdModel) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/register/id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
