import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import urls from '../../../config/urls';
import type { RequestHeaders } from '../../../model/Api';

export const deleteEventApi = async ({ id }: { id: number }) => {
  return await fetch(`${urls.admin}/events/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};
