import { Headers } from '../../../config/headers';
import { RequestHeaders } from '../../../model/Request';

const getTagsApi = async (token: string | undefined) => {
  if (!token) return;

  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/events/tags`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};

export default getTagsApi;