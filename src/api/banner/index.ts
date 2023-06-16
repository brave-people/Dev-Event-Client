import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { BannerResponse } from '../../model/Banner';

export const getBannersApi = async (): Promise<BannerResponse[]> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/banner/mobile/top`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};

export const getBannerApi = async ({
  id,
}: {
  id: string;
}): Promise<BannerResponse> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/banner/mobile/top/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};
