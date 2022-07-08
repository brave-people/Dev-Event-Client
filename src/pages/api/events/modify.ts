import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import urls from '../../../config/urls';
import type { RequestHeaders } from '../../../model/Api';
import type { EventModel } from '../../../model/Event';

export const modifyEventsApi = async ({
  data,
  id,
}: {
  data: EventModel;
  id: string;
}) => {
  return await fetch(`${urls.admin}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
