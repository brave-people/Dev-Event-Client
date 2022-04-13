import { atom } from 'recoil';
import type { UserProfileModel } from '../model/User';

const userKey = 'USER_KEY';
export const userState = atom<UserProfileModel>({
  key: userKey,
  default: {
    user_id: '',
    roles: [],
    name: '',
    email: '',
  },
});
