import { atom } from 'recoil';
import type { UserInfoType } from '../model/User';

const userKey = 'userKey';
export const userState = atom<UserInfoType>({
  key: userKey,
  default: {
    sub: 'admin',
    roles: ['ROLE_ADMIN'],
    iss: '',
    exp: 0,
  },
});
