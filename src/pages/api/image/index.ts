import cookie from 'cookie';
import type { RequestHeaders } from '../../../model/Request';
import { Headers } from '../../../config/headers';

export const fetchUploadImage = async ({ fileType, data }) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/images/${fileType}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
      body: data,
    }
  ).then((res) => res.json());
};
