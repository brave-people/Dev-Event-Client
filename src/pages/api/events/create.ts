import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import { RequestHeaders } from '../../../model/Request';

export const createEventsApi = async ({ data }) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
