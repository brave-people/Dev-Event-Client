import { atom } from 'recoil';
import type { JwtPayload } from 'jsonwebtoken';

const userKey = 'userKey';
export const userState = atom<string | JwtPayload | null>({
  key: userKey,
  default: {
    sub: 'admin',
    roles: ['ROLE_ADMIN'],
    iss: '',
    exp: 0,
  },
});
