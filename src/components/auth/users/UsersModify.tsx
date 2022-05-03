import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { selectedUserState } from '../../../store/User';
import Input from '../../input/Input';

const UsersModify = () => {
  const data = useRecoilValue(selectedUserState);
  console.log(data);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password !== !newPassword)
      return setErrorMessage('패스워드가 서로 일치하지 않아요');
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const changeNewPassword = (e: { target: { value: string } }) => {
    setNewPassword(e.target.value);
  };

  return (
    <>
      <form onSubmit={submit}>
        <Input type="text" text="이름" value={data.name} readonly={true} />
        <Input type="text" text="아이디" value={data.user_id} readonly={true} />
        <Input type="email" text="이메일" value={data.email} readonly={true} />
        <Input
          type="password"
          text="비밀번호"
          value={password}
          onChange={changePassword}
          isRequired={true}
        />
        <Input
          text="비밀번호 확인"
          type="password"
          value={newPassword}
          onChange={changeNewPassword}
        />
        <select name="권한 선택" id="">
          <option value="">관리자</option>
          <option value="">매니저</option>
          <option value="">사용자</option>
        </select>
        <div className="relative">
          <button
            type="submit"
            className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            가입
          </button>
        </div>
      </form>
      <p>{errorMessage}</p>
    </>
  );
};

export default UsersModify;
