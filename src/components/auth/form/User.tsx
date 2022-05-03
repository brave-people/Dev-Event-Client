import { useRouter } from 'next/router';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { registerIdApi } from '../../../pages/api/auth/id';
import { baseRouter, STATUS_201, STATUS_203 } from '../../../config/constants';
import { registerEmailApi } from '../../../pages/api/auth/email';
import { registerUserApi } from '../../../pages/api/auth/register';
import Input from '../../input/Input';

const User = () => {
  const router = useRouter();

  /** form */
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /** message */
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const changeName = (e: { target: { value: string } }) => {
    setName(e.target.value);
  };

  const changeId = (e: { target: { value: string } }) => {
    setId(e.target.value);
    setMessage('');

    registerIdApi({
      user_id: e.target.value,
    }).then((res) => {
      if (res.status_code !== STATUS_203) {
        return setMessage(res.message);
      }
    });
  };

  const changeEmail = (e: { target: { value: string } }) => {
    const email = e.target.value;
    setEmail(email);
    setMessage('');

    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      registerEmailApi({ email }).then((res) => {
        if (res.status_code !== STATUS_203) {
          return setMessage(res.message);
        }
      });
    } else {
      setMessage('이메일 형식이 아닙니다.');
    }
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    registerUserApi({
      name,
      user_id: id,
      email,
      password,
    }).then((res) => {
      if (res.status_code !== STATUS_201) {
        setErrorMessage(res.message);
        return;
      }

      setMessage('축하해요! 가입에 성공하였어요 😎 2초 후 홈으로 이동합니다.');
      return setTimeout(() => router.push(baseRouter() + '/admin/event'), 2000);
    });
  };

  return (
    <>
      <form onSubmit={submit}>
        <Input
          type="text"
          text="이름"
          value={name}
          onChange={changeName}
          isRequired={true}
        />
        <Input
          type="text"
          text="아이디"
          value={id}
          onChange={changeId}
          isRequired={true}
        />
        <Input
          type="email"
          text="이메일"
          value={email}
          onChange={changeEmail}
          isRequired={true}
        />
        <Input
          type="password"
          text="패스워드"
          value={password}
          onChange={changePassword}
          isRequired={true}
        />
        <div className="relative">
          <button
            type="submit"
            className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            가입
          </button>
        </div>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      {message && <p>{message}</p>}
    </>
  );
};

export default User;
