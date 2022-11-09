import Cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';
import type { ReplayResponseModel } from '../../../model/Replay';
import { TokenModel } from '../../../model/User';

export const getReplayEventsApi = async ({
  year,
}: {
  year: number;
}): Promise<ReplayResponseModel[]> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents/search/time/${year}`,
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

export const getReplayEventApi = async ({
  token,
  id,
}: {
  token: TokenModel;
  id: string;
}): Promise<ReplayResponseModel> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token.access_token,
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};
