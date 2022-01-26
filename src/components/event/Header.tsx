import type { UserInfoType } from '../../model/User';
import getUserRoleIsAdmin from '../../util/get-user-role';

const Header = ({ user }: { user: UserInfoType }) => {
  const isAdmin = typeof user !== 'string' && getUserRoleIsAdmin(user?.roles);

  return (
    <header className="admin__header">
      <h1>용감한 관리자</h1>
      <select name="user" id="user-options">
        <option value="">회원 정보 수정</option>
        <option value="">비밀번호 변경</option>
        {isAdmin && <option value="">회원 관리</option>}
        <option value="">로그아웃</option>
      </select>
    </header>
  );
};

export default Header;
