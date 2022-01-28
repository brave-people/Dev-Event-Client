import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { ResponseTokenModel } from '../../model/User';
import { useRouter } from 'next/router';
import { registerUserApi } from '../api/auth/register';
import { registerEmailApi } from '../api/auth/email';
import { registerIdApi } from '../api/auth/id';
import { STATUS_201, STATUS_203 } from '../../config/constants';
import { GetServerSidePropsContext } from 'next/types';
import getToken from '../../server/api/auth/getToken';
import UpdateTokenInCookie from '../../util/update-token-in-cookie';

const SignUp = ({ data }: ResponseTokenModel) => {
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

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
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

      setMessage('축하해요! 가입에 성공하였어요 😎');
      return setTimeout(() => router.push('/admin'), 2000);
    });
  };

  useEffect(() => {
    if (data?.access_token) UpdateTokenInCookie(document, data);
  }, []);

  return (
    <section>
      <h2>용감한 관리자 회원가입</h2>
      <form onSubmit={submit}>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="이름"
          value={name}
          onChange={changeName}
          required
        />
        <input
          id="id"
          type="id"
          name="id"
          placeholder="아이디"
          value={id}
          onChange={changeId}
          required
        />
        <input
          id="email"
          type="email"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={changeEmail}
          required
        />
        <input
          id="password"
          type="password"
          name="password"
          placeholder="패스워드"
          value={password}
          onChange={changePassword}
          required
        />
        <button type="submit">가입</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      {message && <p>{message}</p>}
    </section>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = context.req.headers.cookie;
  const token = await getToken(cookies);
  if (cookies && (!token || token?.error)) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  return { props: token };
};

export default SignUp;
