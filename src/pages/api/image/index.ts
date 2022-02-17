import cookie from 'cookie';
import type { RequestHeaders } from '../../../model/Request';
import type {
  UploadImageProps,
  ResponseUploadImage,
} from '../../../model/Image';
import { Headers } from '../../../config/headers';

export const fetchUploadImage = async ({
  fileType,
  body,
}: UploadImageProps): Promise<ResponseUploadImage> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL}/images/${fileType}`,
    {
      method: 'POST',
      headers: {
        Authorization: cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
      body,
    }
  ).then((res) => res.json());
};
