import type { UserRoleType } from '../model/User';

const getUserRoleIsAdmin = (roles: [UserRoleType]) => {
  return roles.includes('ROLE_ADMIN');
};

export default getUserRoleIsAdmin;
