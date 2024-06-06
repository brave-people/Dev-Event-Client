import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { Host } from '../../model/Host';

export const modifyHostApi = async ({
  data,
  id,
}: {
  data: Host;
  id: string;
}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/hosts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
