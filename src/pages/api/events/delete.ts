import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import { RequestHeaders } from '../../../model/Api';

export const deleteEventApi = async ({ id }: { id: number }) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/events/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};
