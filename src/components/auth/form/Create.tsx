import { useRouter } from 'next/router';
import { useState } from 'react';
import { STATUS_200, STATUS_201, STATUS_400 } from '../../../config/constants';
import { registerIdApi } from '../../../pages/api/auth/id';
import { registerEmailApi } from '../../../pages/api/auth/email';
import { registerUserApi } from '../../../pages/api/auth/register';
import useErrorMessage from '../message/Error';
import useMessage from '../message/Base';
import FormContent from './Content';

const Create = () => {
  const router = useRouter();

  // form
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // message
  const { Message, setMessage } = useMessage();
  const { MessageError, setErrorMessage } = useErrorMessage();
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
      if (res.status_code === STATUS_200) return setMessage(res.message);
      if (res.status_code === STATUS_400) return setErrorMessage(res.message);
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
      setErrorEmailMessage('');

      registerEmailApi({ email }).then((res) => {
        if (res.status_code === STATUS_400)
          return setErrorEmailMessage(res.message);
      });
    } else if (email.length > 0)
      return setErrorEmailMessage('이메일 형식이 아닙니다.');
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const submit = () => {
    if (!name || !id || !email || !password) return;

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
          <MessageError />
          <Message />
        </>
      </FormContent>
    </div>
  );
};

export default Create;
