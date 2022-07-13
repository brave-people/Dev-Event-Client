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
    router.push('/auth/users/modify');
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
    <div className="list">
      <div className="list__table relative mt-4 border rounded">
        <table className="w-full p-4">
          <thead className="list__table--thead">
            <tr>
              <td className="list__table--title">아이디</td>
              <td className="list__table--title">회원유형</td>
              <td className="list__table--title">권한</td>
              <td className="list__table--title">최초 발급일</td>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => {
              return (
                <tr key={`${user.email}_${index}`}>
                  <td>{user.email}</td>
                  <td>{getConvertAuthType(user.auth_type)}</td>
                  <td>
                    {getUserRole(user.roles).map((role, index) => (
                      <span key={index} className="list__table__tag mr-2">
                        {role}
                      </span>
                    ))}
                  </td>
                  <td>{dayjs(user.create_dt).format('YYYY-MM-DD HH:MM')}</td>
                  <td>
                    <div className="list--group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                      <div className="list--group__button">
                        <button
                          className="text-blue-500 font-bold"
                          onClick={() => clickModifyUser(user)}
                        >
                          수정
                        </button>
                        <button
                          className="text-red-500 font-bold"
                          onClick={() => clickDeleteUser(user)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
