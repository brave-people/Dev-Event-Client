import moment from 'moment';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import type { UsersModel } from '../../../model/User';
import { getUsersApi } from '../../../pages/api/auth/users';
import { selectedUserState } from '../../../store/User';
import { getUserRole } from '../../../util/get-user-role';
import { getConvertAuthType } from '../../../util/get-convert-auth-type';
import { baseRouter } from '../../../config/constants';
import User from '../../User';

const Users = () => {
  const router = useRouter();
  const { data } = useQuery(['fetchUsers'], async () => await getUsersApi(), {
    refetchOnWindowFocus: false,
  });
  const setSelectedUser = useSetRecoilState(selectedUserState);

  if (!data || !data.length) return null;

  const onClick = (user: UsersModel) => {
    setSelectedUser(user);
    router.push(baseRouter() + '/auth/users/modify', undefined, {
      shallow: true,
    });
  };

  return (
    <User title="회원관리">
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
                <td>{moment(user.create_dt).format('YYYY-MM-DD HH:MM')}</td>
                <td>
                  <button onClick={() => onClick(user)}>수정</button>
                  <button>삭제</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </User>
  );
};

export default Users;
