import { atom } from 'recoil';
import type { UserProfileModel, UsersModel } from '../model/User';

// 접속한 유저 정보
const userKey = 'USER_KEY';
export const userState = atom<UserProfileModel>({
  key: userKey,
  default: {
    user_id: '',
    roles: [],
    name: '',
    email: '',
    refetch: () => null,
  },
});

// 다른 유저 정보
const selectedUserKey = 'SELECTED_USER_KEY';
export const selectedUserState = atom<UsersModel>({
  key: selectedUserKey,
  default: {
    auth_type: 'NONE',
    create_dt: '',
    update_dt: '',
    email: '',
    name: '',
    roles: [],
    user_id: '',
  },
});
