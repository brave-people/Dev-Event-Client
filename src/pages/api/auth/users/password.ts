import cookie from 'cookie';
import { Headers } from '../../../../config/headers';
import urls from '../../../../config/urls';
import type { RequestHeaders, ResponseModel } from '../../../../model/Api';
import type { PasswordModel } from '../../../../model/User';

export const passwordApi = async ({
  data,
}: {
  data: PasswordModel;
}): Promise<ResponseModel> => {
  return await fetch(`${urls.admin}/users/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
