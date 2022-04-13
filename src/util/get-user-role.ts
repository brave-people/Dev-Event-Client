import type { UserRole } from '../model/User';

export const getUserRole = (roles: UserRole[]) => {
  return roles.reduce((result: string[], role) => {
    if (role.code === 'ROLE_ADMIN') return [...result, '관리자'];
    if (role.code === 'ROLE_USER') return [...result, '사용자'];
    return [...result];
  }, []);
};

export const getUserRoleIsAdmin = (roles: UserRole[] | undefined) => {
  return roles && roles.filter((role) => role.code === 'ROLE_ADMIN');
};
