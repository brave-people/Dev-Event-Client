import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { selectedUserAtom } from '../../../store/user';
import {
  addRoleUsersApi,
  deleteRoleUsersApi,
} from '../../../pages/api/auth/users/role';
import FormContent from './Content';
import type { ChangeEvent } from 'react';
import type { UserRoleType } from '../../../model/User';

const Modify = () => {
  const router = useRouter();
  const [data] = useAtom(selectedUserAtom);
  const convertPrevRoles = data.roles.map((role) => role.code);
  const [roles, setRoles] = useState<Set<UserRoleType>>(
    new Set(convertPrevRoles)
  );
  const [newName, setNewName] = useState(data.name);
  const [newEmail, setNewEmail] = useState(data.email);

  useEffect(() => {
    if (data.name) return;

    alert('변경할 사용자를 먼저 선택해주세요!');
    router.push('/auth/users');
  }, [data]);

  const changeName = (e: { target: { value: string } }) =>
    setNewName(e.target.value);

  const changeEmail = (e: { target: { value: string } }) =>
    setNewEmail(e.target.value);

  const submit = () => {
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
    <div className="list">
      <FormContent
        user_id={data.user_id || ''}
        name={newName}
        changeName={changeName}
        email={newEmail}
        changeEmail={changeEmail}
        buttonLabel="수정"
        submit={submit}
        readonlyList={['id']}
      >
        <div className="form__content__input">
          <label className="form__content__title inline-block text-base font-medium text-gray-600">
            권한
          </label>
          <div className="bg-gray-50 p-2 rounded inline-flex items-center text-sm font-medium">
            <input
              id="checkbox_admin"
              type="checkbox"
              value="ROLE_ADMIN"
              onChange={changeRole}
              checked={roles.has('ROLE_ADMIN')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="checkbox_admin" className="mx-2 text-gray-800">
              관리자
            </label>
          </div>
          <div className="mx-4 bg-gray-50 p-2 rounded inline-flex items-center text-sm font-medium">
            <input
              id="checkbox_manager"
              type="checkbox"
              value="ROLE_MANAGER"
              onChange={changeRole}
              checked={roles.has('ROLE_MANAGER')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="checkbox_manager" className="mx-2 text-gray-800">
              매니저
            </label>
          </div>
          <div className="bg-gray-50 p-2 rounded inline-flex items-center text-sm font-medium">
            <input
              id="checkbox_user"
              type="checkbox"
              value="ROLE_USER"
              onChange={changeRole}
              checked={roles.has('ROLE_USER')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="checkbox_user" className="mx-2 text-gray-800">
              사용자
            </label>
          </div>
        </div>
      </FormContent>
    </div>
  );
};

export default Modify;
