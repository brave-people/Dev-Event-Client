import cookie from 'cookie';
import urls from '../../../config/urls';
import type { UserIdModel } from '../../../model/user';

/** 중복 아이디 체크 */
export const registerIdApi = async (req: UserIdModel) => {
  return await fetch(`${urls.auth}/admin/v1/register/id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
