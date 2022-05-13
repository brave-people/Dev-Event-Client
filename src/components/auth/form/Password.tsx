import { useState } from 'react';
import { useRouter } from 'next/router';
import { passwordApi } from '../../../pages/api/auth/users/password';
import Input from '../../input/Input';
import { STATUS_200 } from '../../../config/constants';

const FormPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const changeNewPassword = (e: { target: { value: string } }) => {
    setNewPassword(e.target.value);
  };

  const changeCheckNewPassword = (e: { target: { value: string } }) => {
    setCheckNewPassword(e.target.value);
  };

  const save = async () => {
    if (!password || !newPassword)
      return setErrorMessage(
        '현재 패스워드, 새로운 패스워드 모두 입력해주세요 :)'
      );

    if (!password !== !newPassword)
      return setErrorMessage('패스워드가 서로 일치하지 않아요');

    const body = {
      current_password: password,
      new_password: newPassword,
    };

    const data = await passwordApi({ data: body });
    if (data.status_code === STATUS_200)
      return await router.push('/admin/event');

    return alert(data.message);
  };

  return (
    <div className="form--large">
      <div className="form__content">
        <Input
          text="현재 비밀번호"
          type="password"
          value={password}
          onChange={changePassword}
        />
        <Input
          text="새 비밀번호"
          type="password"
          value={newPassword}
          onChange={changeNewPassword}
        />
        <Input
          text="새 비밀번호 확인"
          type="password"
          value={checkNewPassword}
          onChange={changeCheckNewPassword}
        />
        <p>{errorMessage}</p>
      </div>
      <button onClick={save}>수정</button>
    </div>
  );
};

export default FormPassword;
