import cookie from 'cookie';
import urls from '../../../../config/urls';
import { Headers } from '../../../../config/headers';
import type { RequestHeaders, ResponseModel } from '../../../../model/Api';
import type { UserRoleType } from '../../../../model/User';

export const addRoleUsersApi = async ({
  data,
}: {
  data: { role_code: UserRoleType; user_id: string };
}): Promise<ResponseModel> => {
  return await fetch(`${urls.admin}/users/role`, {
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
  return await fetch(`${urls.admin}/users/role`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
