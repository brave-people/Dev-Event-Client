import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  addRoleUsersApi,
  deleteRoleUsersApi,
} from '../../../pages/api/auth/users/role';
import { selectedUserState } from '../../../store/User';
import { getConvertAuthType } from '../../../util/get-convert-auth-type';
import Input from '../../input/Input';
import type { FormEvent, ChangeEvent } from 'react';
import type { UserRoleType } from '../../../model/User';

const Modify = () => {
  const router = useRouter();
  const data = useRecoilValue(selectedUserState);
  const convertPrevRoles = data.roles.map((role) => role.code);
  const [roles, setRoles] = useState<Set<UserRoleType>>(
    new Set(convertPrevRoles)
  );

  useEffect(() => {
    if (data.name) return;

    alert('변경할 사용자를 먼저 선택해주세요!');
    router.push('/auth/users', undefined, { shallow: true });
  }, [data]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const removeRoles = convertPrevRoles.filter(
      (prevRole) => !roles.has(prevRole)
    );
    const addRoles = Array.from(roles).filter(
      (prevRole) => !convertPrevRoles.includes(prevRole)
    );

    const removeRolesData = removeRoles.map(
      async (role) =>
        await deleteRoleUsersApi({
          data: { role_code: role, user_id: data.user_id || '' },
        })
    );

    const addRolesData = addRoles.map(
      async (role) =>
        await addRoleUsersApi({
          data: { role_code: role, user_id: data.user_id || '' },
        })
    );

    Promise.all([removeRolesData, addRolesData])
      .then(async () => {
        await alert('권한 부여에 성공했어요! 유저목록으로 이동합니다');
        return router.push('/auth/users');
      })
      .catch((err) => console.error('권한 부여에 실패했어요: ', err));
  };

  const changeRole = (e: ChangeEvent<HTMLInputElement>) => {
    const currentRoles = new Set(roles);
    e.target.checked
      ? currentRoles.add(e.target.value as UserRoleType)
      : currentRoles.delete(e.target.value as UserRoleType);
    setRoles(currentRoles);
  };

  return (
    <form onSubmit={submit}>
      <Input type="text" text="이름" value={data.name} readonly={true} />
      <Input
        type="text"
        text="아이디"
        value={data.user_id || ''}
        readonly={true}
      />
      <Input type="email" text="이메일" value={data.email} readonly={true} />
      <Input
        type="text"
        text="회원유형"
        value={getConvertAuthType(
          'auth_type' in data ? data.auth_type : 'NONE'
        )}
        readonly={true}
      />
      <input
        id="checkbox_admin"
        type="checkbox"
        value="ROLE_ADMIN"
        onChange={changeRole}
        checked={roles.has('ROLE_ADMIN')}
      />
      <label htmlFor="checkbox_admin">관리자</label>
      <input
        id="checkbox_admin"
        type="checkbox"
        value="ROLE_MANAGER"
        onChange={changeRole}
        checked={roles.has('ROLE_MANAGER')}
      />
      <label htmlFor="checkbox_admin">매니저</label>
      <input
        id="checkbox_admin"
        type="checkbox"
        value="ROLE_USER"
        onChange={changeRole}
        checked={roles.has('ROLE_USER')}
      />
      <label htmlFor="checkbox_admin">사용자</label>
      <div className="relative">
        <button
          type="submit"
          className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          가입
        </button>
      </div>
    </form>
  );
};

export default Modify;
