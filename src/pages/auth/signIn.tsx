import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { GetServerSidePropsContext } from 'next/types';
import type { ResponseTokenModel } from '../../model/User';
import { loginApi } from '../api/login';
import { useRouter } from 'next/router';
import UpdateTokenInCookie from '../../util/update-token-in-cookie';
import getToken from '../../server/api/auth/getToken';

const SignIn = ({ data }: ResponseTokenModel) => {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const changeId = (e: { target: { value: string } }) => {
    setId(e.target.value);
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (id && password) {
      setLoading(true);

      await loginApi({ user_id: id, password }).then(
        (res: ResponseTokenModel) => {
          if (res.message) {
            return setMessage(res.message);
          }

          return UpdateTokenInCookie(document, res.data);
        }
      );

      await router.push('/admin');
    }
  };

  useEffect(() => {
    if (data?.access_token) UpdateTokenInCookie(document, data);
  }, []);

  return (
    <section>
      <h2>용감한 관리자</h2>
      <form onSubmit={submit} className="form">
        <input
          id="id"
          placeholder="관리자 아이디"
          type="text"
          onChange={changeId}
          required
        />
        <input
          id="password"
          placeholder="비밀번호"
          type="password"
          onChange={changePassword}
          required
        />
        <button type="submit">로그인</button>
      </form>
      {message && <p>{message}</p>}
      {!message && loading && <p>로그인중입니다 :) 잠시만 기다려주세요</p>}
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

export default SignIn;
