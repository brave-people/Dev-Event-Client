import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { EventType } from '../../model/Event';

export const modifyEventsApi = async ({
  data,
  id,
}: {
  data: EventType;
  id: string;
}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V2_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
