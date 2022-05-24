import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { deleteUsersApi, getUsersApi } from '../../pages/api/auth/users';
import { userState, selectedUserState } from '../../store/User';
import { getUserRole } from '../../util/get-user-role';
import { getConvertAuthType } from '../../util/get-convert-auth-type';
import { getUserRoleIsAdmin } from '../../util/get-user-role';
import type { UsersModel } from '../../model/User';

const Users = () => {
  const router = useRouter();
  const { data, refetch } = useQuery(
    ['fetchUsers'],
    async () => await getUsersApi(),
    {
      refetchOnWindowFocus: false,
    }
  );
  const user = useRecoilValue(userState);
  const setSelectedUser = useSetRecoilState(selectedUserState);
  const isAdmin = getUserRoleIsAdmin(user?.roles);

  if (!data || !data.length) return null;

  const clickModifyUser = (user: UsersModel) => {
    setSelectedUser(user);
    router.push('/auth/users/modify', undefined, {
      shallow: true,
    });
  };

  const clickDeleteUser = async (user: UsersModel) => {
    if (!isAdmin) return alert('관리자만 삭제할 수 있어요!');
    const body = {
      auth_type: user.auth_type,
      user_id: user.user_id,
    };
    await deleteUsersApi({ data: body });
    alert('계정 삭제에 성공하였어요!');
    await refetch();
  };

  return (
    <table>
      <thead>
        <tr>
          <td>아이디</td>
          <td>회원유형</td>
          <td>권한</td>
          <td>최초 발급일</td>
        </tr>
      </thead>
      <tbody>
        {data.map((user, index) => {
          return (
            <tr key={`${user.email}_${index}`}>
              <td>{user.email}</td>
              <td>{getConvertAuthType(user.auth_type)}</td>
              <td>{getUserRole(user.roles)}</td>
              <td>{dayjs(user.create_dt).format('YYYY-MM-DD HH:MM')}</td>
              <td>
                <button onClick={() => clickModifyUser(user)}>수정</button>
                <button onClick={() => clickDeleteUser(user)}>삭제</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Users;
