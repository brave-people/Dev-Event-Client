import cookie from 'cookie';
import type { UserEmailModel } from '../../../model/User';
import type { RequestHeaders } from '../../../model/Api';
import { Headers } from '../../../config/headers';

/** 중복 이메일 체크 */
export const registerEmailApi = async (req: UserEmailModel) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/register/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
