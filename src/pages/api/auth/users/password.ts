import cookie from 'cookie';
import { Headers } from '../../../../config/headers';
import type { RequestHeaders, ResponseModel } from '../../../../model/Api';
import type { PasswordModel } from '../../../../model/User';

export const passwordApi = async ({
  data,
}: {
  data: PasswordModel;
}): Promise<ResponseModel> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/users/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
