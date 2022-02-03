import type { ResponseTokenModel, UserModel } from '../../model/User';
import Headers from '../../config/headers';

export const loginApi = async (req: UserModel): Promise<ResponseTokenModel> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...Headers,
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());

  return { data: response, message: response.message };
};
