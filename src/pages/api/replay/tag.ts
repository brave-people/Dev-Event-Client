import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';
import type { Tag } from '../../../model/Tag';

const getTagsApi = async (token?: string): Promise<Tag[]> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents/tags`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
          ? token
          : cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};

export { getTagsApi };
