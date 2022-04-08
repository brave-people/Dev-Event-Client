import type { UserRoleType } from '../model/User';

export const getUserRole = (roles: [UserRoleType]) => {
  return roles.map((role) => {
    if (role === 'ROLE_ADMIN') return '관리자';
    if (role === 'ROLE_USER') return '사용자';
  });
};

export const getUserRoleIsAdmin = (roles: [UserRoleType]) => {
  return roles?.includes('ROLE_ADMIN');
};
