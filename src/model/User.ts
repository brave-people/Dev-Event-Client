import type { JwtPayload } from 'jsonwebtoken';
import type { MouseEventHandler, ReactElement } from 'react';

/** user info 관련 타입 */
export type UserRoleType = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_USER';
export type UserSubType = 'admin' | 'user';
export type UserInfoType = string | JwtPayload | null;
export type UserAuthType =
  | 'NONE'
  | 'ADMIN'
  | 'KAKAO'
  | 'NAVER'
  | 'GOOGLE'
  | 'GITHUB';

// auth 관련 모델
export interface UserIdModel {
  user_id: string;
}

export interface UserEmailModel {
  email: string;
}

export interface UserNameModel {
  name: string;
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
  refetch: () => void;
}

export type ResponseTokenModel = { data?: string; error?: boolean };

export interface PasswordModel {
  current_password: string;
  new_password: string;
}

export interface UsersModel {
  user_no: number;
  auth_type: UserAuthType;
  create_dt: string;
  update_dt: string;
  email: string;
  name: string;
  roles: UserRole[];
  user_id: string;
}

export interface UserContent extends Omit<UserRegisterModel, 'password'> {
  password?: string;
  changeUserId?: (e: { target: { value: string } }) => void;
  changeName: (e: { target: { value: string } }) => void;
  changeEmail: (e: { target: { value: string } }) => void;
  changePassword?: (e: { target: { value: string } }) => void;
  errorEmailMessage?: string;
  roles?: UserRole[];
  buttonLabel: string;
  submit: MouseEventHandler<HTMLButtonElement>;
  readonlyList?: string[];
  children: ReactElement;
}
