import { atom } from 'jotai';
import type { UserProfileModel, UsersModel } from '../model/User';

// 접속한 유저 정보
export const userAtom = atom<UserProfileModel>({
  user_id: '',
  roles: [],
  name: '',
  email: '',
  refetch: () => null,
});

// 다른 유저 정보
export const selectedUserAtom = atom<UsersModel | UserProfileModel>({
  auth_type: 'NONE',
  create_dt: '',
  update_dt: '',
  email: '',
  name: '',
  roles: [],
  user_id: '',
});
