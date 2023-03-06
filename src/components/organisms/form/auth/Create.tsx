import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerEmailApi } from '../../../../api/auth/email';
import { registerIdApi } from '../../../../api/auth/id';
import { registerUserApi } from '../../../../api/auth/register';
import {
  STATUS_200,
  STATUS_201,
  STATUS_400,
} from '../../../../config/constants';
import useErrorMessage from '../../../molecules/toast/Error';
import SuccessPopup from '../../../molecules/toast/Success';
import FormContent from './Content';

const Create = () => {
  const router = useRouter();

  // form
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ showSuccessPopup, successPopupMessage }, setShowSuccessPopup] =
    useState({ showSuccessPopup: false, successPopupMessage: '' });

  const [error, setError] = useState({
    name: { show: false },
    email: { show: false, message: '' },
    password: { show: false },
  });

  // toast
  const { MessageError, setErrorMessage } = useErrorMessage();

  const changeName = (e: { target: { value: string } }) => {
    setName(e.target.value);
  };

  const changeUserId = (e: { target: { value: string } }) => {
    setId(e.target.value);
    setShowSuccessPopup((prev) => ({ ...prev, showSuccessPopup: false }));

    registerIdApi({
      user_id: e.target.value,
    }).then((res) => {
      if (res.status_code === STATUS_200)
        return setShowSuccessPopup({
          showSuccessPopup: true,
          successPopupMessage: res.message,
        });

      if (res.status_code === STATUS_400) return setErrorMessage(res.message);
    });
  };

  const changeEmail = (e: { target: { value: string } }) => {
    const email = e.target.value;
    setEmail(email);
    setError((prev) => ({ ...prev, email: { show: false, message: '' } }));

    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      setError((prev) => ({ ...prev, email: { show: false, message: '' } }));

      registerEmailApi({ email }).then((res) => {
        if (res.status_code === STATUS_400)
          return setError((prev) => ({
            ...prev,
            email: { show: true, message: res.message },
          }));
      });
    } else if (email.length > 0)
      return setError((prev) => ({
        ...prev,
        email: { show: true, message: '이메일 형식이 아니에요!' },
      }));
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const submit = () => {
    if (!name || !id || !email || !password)
      return setError({
        name: { show: !name },
        email: { show: !email, message: '' },
        password: { show: !password },
      });

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

      setShowSuccessPopup({
        showSuccessPopup: true,
        successPopupMessage:
          '축하해요! 가입에 성공하였어요 😎 2초 후 유저목록으로 이동합니다.',
      });
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
        error={error}
        buttonLabel="가입"
        submit={submit}
      >
        <>
          <MessageError />
          <SuccessPopup
            show={showSuccessPopup}
            message={successPopupMessage}
            setShow={setShowSuccessPopup}
          />
        </>
      </FormContent>
    </div>
  );
};

export default Create;
