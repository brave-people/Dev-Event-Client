import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';
import type { Tag, TagName } from '../../../model/Tag';

const createTagApi = async (data: TagName) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/events/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export { createTagApi };
