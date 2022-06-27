import { useState } from 'react';
import { useRouter } from 'next/router';
import { STATUS_200 } from '../../../config/constants';
import { passwordApi } from '../../../pages/api/auth/users/password';
import Input from '../../input/Input';

const Password = () => {
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

  const submit = async () => {
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

    return data.message && setErrorMessage(data.message);
  };

  return (
    <div className="list">
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
          {errorMessage && (
            <div className="list__button--pop--right bg-red-500">
              <button onClick={() => setErrorMessage('')}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {errorMessage}
            </div>
          )}
        </div>
        <button
          className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={submit}
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default Password;
