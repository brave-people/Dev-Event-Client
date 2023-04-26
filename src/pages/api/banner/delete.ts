import Cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';

export const deleteBannersApi = async ({ id }: { id: number }) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/banner/mobile/top/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};
