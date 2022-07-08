import { Headers } from '../../../config/headers';
import urls from '../../../config/urls';
import type { RequestHeaders } from '../../../model/Api';

const getTagsApi = async (token: string | undefined) => {
  if (!token) return;

  return await fetch(`${urls.admin}/events/tags`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};

export default getTagsApi;
