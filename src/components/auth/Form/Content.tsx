import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import stores from '../../../store';
import { getUserRole } from '../../../util/get-user-role';
import Input from '../../input/Input';
import { UserProfileModel } from '../../../model/User';

const FormContent = ({
  id = '',
  name = '',
  email = '',
  roles = [],
}: UserProfileModel) => {
  const user = useRecoilValue(stores.user);
  const [newId, setNewId] = useState(id);
  const [newName, setNewUserName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [hasModify, setHasModify] = useState(false);
  const convertRoles = getUserRole(roles);

  if (!user) return null;

  const changeId = (e: { target: { value: string } }) => {
    console.log(e.target.value);
    setNewId(e.target.value);
  };

  const changeUserName = (e: { target: { value: string } }) =>
    setNewUserName(e.target.value);

  const changeEmail = (e: { target: { value: string } }) =>
    setNewEmail(e.target.value);

  return (
    <div className="form--large">
      <div className="form__content">
        <Input
          text="아이디"
          value={newId}
          onChange={changeId}
          isRequired={true}
          readonly={!hasModify}
        />
        <Input
          text="이름"
          value={newName}
          onChange={changeUserName}
          isRequired={true}
          readonly={!hasModify}
        />
        <Input
          text="이메일"
          value={newEmail}
          onChange={changeEmail}
          isRequired={true}
          readonly={!hasModify}
          type="email"
        />
        {convertRoles.length > 0 && (
          <>
            <span className="form__content__title inline-block text-base font-medium text-gray-600">
              권한
            </span>
            {convertRoles.map((role, index) => (
              <button key={index}>{role}</button>
            ))}
          </>
        )}
      </div>
      <button onClick={() => setHasModify(true)}>
        {hasModify ? '저장' : '수정'}
      </button>
    </div>
  );
};

export default FormContent;
