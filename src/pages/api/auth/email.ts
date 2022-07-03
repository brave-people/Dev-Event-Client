import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import urls from '../../../config/urls';
import type { UserEmailModel } from '../../../model/User';
import type { RequestHeaders } from '../../../model/Api';

/** 중복 이메일 체크 */
export const registerEmailApi = async (req: UserEmailModel) => {
  return await fetch(`${urls.admin}/register/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
