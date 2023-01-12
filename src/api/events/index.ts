import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { CalendarProps } from '../../model/Calendar';
import type { RequestHeaders } from '../../model/Api';
import type { EventResponseModel } from '../../model/Event';

export const getEventsApi = async ({
  year,
  month,
}: CalendarProps): Promise<EventResponseModel[]> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V2_URL}/events/${year}/${month}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};

export const getEventApi = async ({
  id,
}: {
  id: string;
}): Promise<EventResponseModel> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V2_URL}/events/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};
