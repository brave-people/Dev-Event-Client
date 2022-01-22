import urls from '../../config/urls';
import type { ResponseTokenModel, UserModel } from '../../model/user';

export const loginApi = async (req: UserModel): Promise<ResponseTokenModel> => {
  const response = await fetch(`${urls.auth}/admin/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());

  return { data: response, message: response.message };
};
