import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { CalendarProps } from '../../../model/Calendar';
import type { RequestHeaders } from '../../../model/Request';
import type { EventResponseModel } from '../../../model/Event';

export const getEventsApi = async ({
  year,
  month,
}: CalendarProps): Promise<EventResponseModel[]> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/events/${year}/${month}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};

export const getDeleteEventApi = async ({ id }: { id: number }) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/events/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};
