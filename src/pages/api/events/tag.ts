import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import urls from '../../../config/urls';
import type { RequestHeaders } from '../../../model/Api';
import type { TagNameModel } from '../../../model/Tag';

const createTagApi = async (data: TagNameModel) => {
  return await fetch(`${urls.admin}/events/tags`, {
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
