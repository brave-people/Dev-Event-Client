import cookie from 'cookie';
import { Headers } from '../../../config/headers';
import urls from '../../../config/urls';
import type { RequestHeaders } from '../../../model/Api';
import type {
  UploadImageProps,
  ResponseUploadImage,
} from '../../../model/Image';

export const fetchUploadImage = async ({
  fileType,
  body,
}: UploadImageProps): Promise<ResponseUploadImage> => {
  return await fetch(`${urls.admin}/images/${fileType}`, {
    method: 'POST',
    headers: {
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body,
  }).then((res) => res.json());
};
