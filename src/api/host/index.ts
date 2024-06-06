import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { HostResponse } from '../../model/Host';

export const getHostsApi = async (): Promise<HostResponse[]> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/hosts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};

export const getHostApi = async ({
  id,
}: {
  id: string;
}): Promise<HostResponse> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/hosts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};
