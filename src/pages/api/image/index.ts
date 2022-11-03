import Cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';
import type {
  UploadImageProps,
  ResponseUploadImage,
} from '../../../model/Image';

export const fetchUploadImage = async ({
  fileType,
  body,
}: UploadImageProps): Promise<ResponseUploadImage> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/images/${fileType}`,
    {
      method: 'POST',
      headers: {
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
      body,
    }
  ).then((res) => res.json());
};
