import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import urls from '../../../config/urls';
import type { UserIdModel } from '../../../model/User';
import type { RequestHeaders } from '../../../model/Api';

/** 중복 아이디 체크 */
export const registerIdApi = async (req: UserIdModel) => {
  return await fetch(`${urls.admin}/register/id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
