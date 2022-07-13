import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { EventResponseModel } from '../../../model/Event';
import type { RequestHeaders } from '../../../model/Api';

export const getReplayApi = async ({
  year,
}: {
  year: number;
}): Promise<EventResponseModel[]> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/replayEvents/search/time/${year}`,
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
