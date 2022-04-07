import type { TokenModel } from '../model/User';

const getCookie = (document: Document, key: string) => {
  return document.cookie.split(';').some((c) => c.trim().startsWith(key + '='));
};

export const useUpdateCookie = (document: Document, data: TokenModel) => {
  if (!data) return;
  return Object.entries(data).forEach(
    (key) => (document.cookie = `${key[0]}=${key[1]}; path=/;`)
  );
};

export const useDeleteCookie = (document: Document, key: string) => {
  if (!getCookie(document, key)) return;
  document.cookie = key + '=; Max-Age=-99999999;path=/;';
};
