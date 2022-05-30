import { useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import cookies from 'js-cookie';
import { loginApi } from '../api/auth/login';
import { useUpdateCookie } from '../../util/use-cookie';
import Input from '../../components/input/Input';
import Checkbox from '../../components/input/Checkbox';
import type { FormEvent } from 'react';
import type { NextPageContext } from 'next/types';
import type { ResponseTokenModel } from '../../model/User';

const SignIn = ({ data }: { data: string | null }) => {
  const router = useRouter();
  const [id, setId] = useState(data || '');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(!!data);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const changeId = (e: { target: { value: string } }) => {
    setId(e.target.value);
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const changeSaveId = () => {
    setSaveId(!saveId);

    if (saveId) return cookies.remove('save_id');
    cookies.set('save_id', JSON.stringify({ save_id: id }));
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

    router.push('/admin/event', undefined, { shallow: true });
  };

  return (
    <section className="wrap--vertical">
      <article className="wrap__box--lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">
          용감한 관리자 로그인
        </h1>
        <form onSubmit={submit} className="form">
          <Input
            type="text"
            value={id}
            onChange={changeId}
            placeholder="아이디"
            isRequired={true}
          />
          <Input
            type="password"
            value={password}
            onChange={changePassword}
            placeholder="비밀번호"
            isRequired={true}
          />
          <div className="checkbox--blue mb-4">
            <Checkbox
              value={saveId}
              onChange={changeSaveId}
              label="아이디 저장"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white text-md rounded"
          >
            로그인
          </button>
        </form>
        {message && <p>{message}</p>}
        {!message && loading && <p>로그인중입니다 :) 잠시만 기다려주세요</p>}
      </article>
    </section>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const parsedCookies = cookies && cookie.parse(cookies);

  if (parsedCookies && parsedCookies['save_id']) {
    return {
      props: {
        data: JSON.parse(parsedCookies['save_id']).save_id,
      },
    };
  }

  return { props: { data: null } };
};

export default SignIn;
