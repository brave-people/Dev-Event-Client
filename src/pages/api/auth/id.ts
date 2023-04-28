import Cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';
import type { UserIdModel } from '../../../model/User';

// 중복 아이디 체크
export const registerIdApi = async (req: UserIdModel) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/register/id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
