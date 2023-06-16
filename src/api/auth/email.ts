import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { UserEmailModel } from '../../model/User';

// 중복 이메일 체크
export const registerEmailApi = async (req: UserEmailModel) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/register/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
