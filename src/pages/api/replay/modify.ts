import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';
import type { ReplayModel } from '../../../model/Replay';

export const modifyReplayApi = async ({
  data,
  id,
}: {
  data: ReplayModel;
  id: string;
}) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
      body: JSON.stringify(data),
    }
  ).then((res) => res.json());
};
