import type { HeadersInit } from 'next/dist/server/web/spec-compliant/headers';
import {
  STATUS_200,
  STATUS_201,
  STATUS_203,
  STATUS_400,
  STATUS_404,
} from '../config/constants';

type Status =
  | typeof STATUS_200
  | typeof STATUS_201
  | typeof STATUS_203
  | typeof STATUS_400
  | typeof STATUS_404;

export type RequestHeaders = HeadersInit & {
  APP_NAME: string;
  APP_TOKEN: string;
};

export interface ResponseModel {
  status_code: number;
  status: Status;
  message: string;
}
