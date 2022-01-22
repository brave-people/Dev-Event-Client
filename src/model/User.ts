import type { JwtPayload } from 'jsonwebtoken';

/** user info 관련 타입 */
export type UserRoleType = 'ROLE_ADMIN' | 'ROLE_USER';
export type UserSubType = 'admin' | 'user';
export type UserInfoType = string | JwtPayload | null;

/** auth 관련 모델*/
export interface UserIdModel {
  user_id: string;
}

export interface UserEmailModel {
  email: string;
}

export interface UserModel extends UserIdModel {
  password: string;
}

export interface UserRegisterModel extends UserModel {
  name: string;
  email: string;
}

export interface TokenModel {
  access_token: string;
  access_token_expired_at: string;
  refresh_token: string;
  refresh_token_expired_at: string;
}

export interface ResponseTokenModel {
  data: TokenModel;
  message: string;
}
