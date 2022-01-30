import cookie from 'cookie';
import type { UserEmailModel } from '../../../model/User';

/** 중복 이메일 체크 */
export const registerEmailApi = async (req: UserEmailModel) => {
  return await fetch(`${process.env.ADMIN_URL}/register/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
