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
        useUpdateCookie(document, res.data);
        router.push('/admin/event');
      }
    );
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
          {!message && loading && (
            <p className="mb-4 p-2 bg-yellow-50 font-bold text-yellow-600 text-sm">
              😆 로그인 처리중입니다.
            </p>
          )}
          {message && (
            <p className="mb-4 p-2 bg-red-50 rounded font-bold text-red-600 text-sm">
              <svg
                className="w-4 h-4 mr-1 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {message}
            </p>
          )}
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
