import Cookie from 'cookie';
import { Headers } from '../../../../config/headers';
import type { RequestHeaders, ResponseModel } from '../../../../model/Api';
import type {
  UserEmailModel,
  UserNameModel,
  UsersModel,
  UserAuthType,
  UserIdModel,
} from '../../../../model/User';

export const getUsersApi = async (): Promise<UsersModel[]> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/users`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};

export const modifyUsersApi = async ({
  data,
}: {
  data: UserEmailModel & UserNameModel;
}): Promise<ResponseModel> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/users`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const deleteUsersApi = async ({
  data,
}: {
  data: UserIdModel & { auth_type: UserAuthType };
}): Promise<ResponseModel> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/users`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
