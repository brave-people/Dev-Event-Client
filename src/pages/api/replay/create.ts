import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';
import type { ReplayModel } from '../../../model/Replay';

export const createReplayApi = async ({ data }: { data: ReplayModel }) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
