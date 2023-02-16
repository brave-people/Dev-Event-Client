import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { UserModel, ResponseSignInModel } from '../../model/User';

export const loginApi = async (
  req: UserModel
): Promise<ResponseSignInModel> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/login`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...Headers(),
      } as RequestHeaders,
      body: JSON.stringify(req),
    }
  ).then((res) => res.json());

  return { data: response, message: response.message };
};
