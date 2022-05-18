import { RequestHeaders, ResponseModel } from '../../../../model/Api';
import cookie from 'cookie';
import { Headers } from '../../../../config/headers';
import { UserRoleType } from '../../../../model/User';

export const addRoleUsersApi = async ({
  data,
}: {
  data: { role_code: UserRoleType; user_id: string };
}): Promise<ResponseModel> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/users/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const deleteRoleUsersApi = async ({
  data,
}: {
  data: { role_code: UserRoleType; user_id: string };
}): Promise<ResponseModel> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/users/role`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
