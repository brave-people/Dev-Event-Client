import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useAtomValue } from 'jotai';
import type { UserRoleType } from '../../../../model/User';
import { modifyUsersApi } from '../../../../pages/api/auth/users';
import {
  addRoleUsersApi,
  deleteRoleUsersApi,
} from '../../../../pages/api/auth/users/role';
import { selectedUserAtom } from '../../../../store/User';
import Checkbox from '../../../atoms/input/Checkbox';
import FormContent from './Content';

const Modify = () => {
  const router = useRouter();

  const selectUser = useAtomValue(selectedUserAtom);
  const convertPrevRoles = selectUser.roles.map((role) => role.code);

  const [roles, setRoles] = useState<Set<UserRoleType>>(
    new Set(convertPrevRoles)
  );
  const [newName, setNewName] = useState(selectUser.name);
  const [newEmail, setNewEmail] = useState(selectUser.email);

  const [error, setError] = useState({
    name: { show: false },
    email: { show: false, message: '' },
  });

  useEffect(() => {
    if (selectUser.name) return;

    alert('변경할 사용자를 먼저 선택해주세요!');
    router.push('/auth/users');
  }, [selectUser]);

  const changeName = (e: { target: { value: string } }) => {
    setNewName(e.target.value);
  };

  const changeEmail = (e: { target: { value: string } }) => {
    setNewEmail(e.target.value);
  };

  const submit = () => {
    if (!newName || !newEmail)
      return setError({
        name: { show: !newName },
        email: { show: !newEmail, message: '' },
      });

    const changedName = newName !== selectUser.name;
    const changedEmail = newEmail !== selectUser.email;

    const removeRoles = convertPrevRoles.filter(
      (prevRole) => !roles.has(prevRole)
    );
    const addRoles = Array.from(roles).filter(
      (prevRole) => !convertPrevRoles.includes(prevRole)
    );

    const modifyUsersData = async () =>
      (changedName || changedEmail) &&
      (await modifyUsersApi({ data: { name: newName, email: newEmail } }));

    const removeRolesData = removeRoles.map(
      async (role) =>
        await deleteRoleUsersApi({
          data: { role_code: role, user_id: selectUser.user_id || '' },
        })
    );

    const addRolesData = addRoles.map(
      async (role) =>
        await addRoleUsersApi({
          data: { role_code: role, user_id: selectUser.user_id || '' },
        })
    );

    Promise.all([removeRolesData, addRolesData, modifyUsersData()])
      .then(() => alert('회원정보 수정에 성공했어요!'))
      .catch((err) => console.error('회원정보 수정에 실패했어요: ', err));
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
        user_id={selectUser.user_id || ''}
        name={newName}
        email={newEmail}
        changeName={changeName}
        changeEmail={changeEmail}
        buttonLabel="수정"
        submit={submit}
        readonlyList={['id']}
        error={error}
      >
        <div className="form__content__input">
          <label className="form__content__title inline-block text-base font-medium text-gray-600">
            권한
          </label>
          <div className="bg-gray-50 p-2 rounded inline-flex items-center text-sm font-medium">
            <Checkbox
              label="관리자"
              checked={roles.has('ROLE_ADMIN')}
              onChange={changeRole}
              value="ROLE_ADMIN"
            />
          </div>
          <div className="mx-4 bg-gray-50 p-2 rounded inline-flex items-center text-sm font-medium">
            <Checkbox
              label="매니저"
              checked={roles.has('ROLE_MANAGER')}
              onChange={changeRole}
              value="ROLE_MANAGER"
            />
          </div>
          <div className="bg-gray-50 p-2 rounded inline-flex items-center text-sm font-medium">
            <Checkbox
              label="사용자"
              checked={roles.has('ROLE_USER')}
              onChange={changeRole}
              value="ROLE_USER"
            />
          </div>
        </div>
      </FormContent>
    </div>
  );
};

export default Modify;
