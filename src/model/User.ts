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

export interface UserModel {
  user_id: string;
  password: string;
}

export interface UserRegisterModel {
  user_id: string;
  password: string;
  name: string;
  email: string;
}

export interface UserRole {
  code: UserRoleType;
  name: string;
  description: string;
}

export interface UserProfileModel {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  roles: UserRole[];
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
  error?: string;
}
