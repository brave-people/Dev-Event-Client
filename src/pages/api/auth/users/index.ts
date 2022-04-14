import cookie from 'cookie';
import { Headers } from '../../../../config/headers';
import type { RequestHeaders, ResponseModel } from '../../../../model/Api';
import type { UserEmailModel, UserNameModel } from '../../../../model/User';

export const modifyUsersApi = async ({
  data,
}: {
  data: UserEmailModel & UserNameModel;
}): Promise<ResponseModel> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/users`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
