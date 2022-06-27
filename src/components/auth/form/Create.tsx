import { useRouter } from 'next/router';
import { useState } from 'react';
import { STATUS_201, STATUS_203 } from '../../../config/constants';
import { registerIdApi } from '../../../pages/api/auth/id';
import { registerEmailApi } from '../../../pages/api/auth/email';
import { registerUserApi } from '../../../pages/api/auth/register';
import FormContent from './Content';

const Create = () => {
  const router = useRouter();

  // form
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // message
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorEmailMessage, setErrorEmailMessage] = useState('');

  const changeName = (e: { target: { value: string } }) => {
    setName(e.target.value);
  };

  const changeUserId = (e: { target: { value: string } }) => {
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
    setErrorEmailMessage('');

    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      registerEmailApi({ email }).then((res) => {
        if (res.status_code !== STATUS_203) {
          return setErrorEmailMessage(res.message);
        }
      });
    }

    if (email.length > 0) setErrorEmailMessage('이메일 형식이 아닙니다.');
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const submit = (e: MouseEvent) => {
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

      setMessage(
        '축하해요! 가입에 성공하였어요 😎 2초 후 유저목록으로 이동합니다.'
      );
      return setTimeout(() => router.push('/auth/users'), 2000);
    });
  };

  return (
    <div className="list">
      <FormContent
        user_id={id}
        name={name}
        email={email}
        password={password}
        changeUserId={changeUserId}
        changeName={changeName}
        changeEmail={changeEmail}
        changePassword={changePassword}
        errorEmailMessage={errorEmailMessage}
        buttonLabel="가입"
        submit={submit}
      >
        <>
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
          {message && (
            <div className="list__button--pop--right bg-blue-500">
              <button onClick={() => setMessage('')}>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              {message}
            </div>
          )}
        </>
      </FormContent>
    </div>
  );
};

export default Create;
