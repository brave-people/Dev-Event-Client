import Cookie from 'cookie';
import { Headers } from '../../../config/headers';
import type { RequestHeaders } from '../../../model/Api';
import type { Tag, TagName } from '../../../model/Tag';

export const createTagApi = async (data: TagName) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents/tags`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
      body: JSON.stringify(data),
    }
  ).then((res) => res.json());
};

export const modifyTagApi = async (data: TagName, id: number) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents/tags/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
      body: JSON.stringify(data),
    }
  ).then((res) => res.json());
};

export const deleteTagApi = async (id: number) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents/tags/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};

export const getTagsApi = async (token?: string): Promise<Tag[]> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/replayEvents/tags`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
          ? token
          : Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};
