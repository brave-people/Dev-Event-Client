import cookie from 'cookie';
import type { CalendarProps } from '../../../model/Calendar';

export const getEventsApi = async ({ year, month }: CalendarProps) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/events/${year}/${month}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
    },
  }).then((res) => res.json());
};
