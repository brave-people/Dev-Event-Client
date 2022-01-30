import type { ResponseTokenModel, UserModel } from '../../model/User';

export const loginApi = async (req: UserModel): Promise<ResponseTokenModel> => {
  const response = await fetch(`${process.env.ADMIN_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());

  return { data: response, message: response.message };
};
