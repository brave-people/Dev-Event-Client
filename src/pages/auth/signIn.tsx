import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/router';
import type { ResponseTokenModel } from '../../model/User';
import { loginApi } from '../api/auth/login';
import { useUpdateCookie } from '../../util/use-cookie';
import { baseRouter } from '../../config/constants';

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

    if (!id || !password) return;

    setLoading(true);
    await loginApi({ user_id: id, password }).then(
      (res: ResponseTokenModel) => {
        if (res.message) return setMessage(res.message);

        setLoading(false);
        return useUpdateCookie(document, res.data);
      }
    );

    router.push(baseRouter() + '/admin/event', undefined, { shallow: true });
  };

  useEffect(() => {
    if (data?.access_token) useUpdateCookie(document, data);
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

export default SignIn;
