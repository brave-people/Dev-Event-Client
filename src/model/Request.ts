import type { HeadersInit } from 'next/dist/server/web/spec-compliant/headers';
export type RequestHeaders = HeadersInit & {
  APP_NAME: string;
  APP_TOKEN: string;
};
