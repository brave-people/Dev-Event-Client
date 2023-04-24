import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { Tag, TagName } from '../../model/Tag';

const createTagApi = async (
  data: TagName
): Promise<{ status_code: number }> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/events/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

const modifyTagApi = async (
  data: TagName,
  id: number
): Promise<{ status_code: number }> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/events/tags/${id}`,
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

const deleteTagApi = async (id: number) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/events/tags/${id}`,
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

const getTagsApi = async (): Promise<Tag[]> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/events/tags`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};

export { createTagApi, modifyTagApi, deleteTagApi, getTagsApi };
