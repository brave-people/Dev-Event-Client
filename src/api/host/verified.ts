import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';

export const updateHostVerifiedApi = async ({
  id,
  verified,
}: {
  id: number;
  verified: boolean;
}) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/hosts/${id}/verified`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
      body: JSON.stringify({ verified }),
    }
  ).then((res) => res.json());
};
