'use client';

import Cookies from 'js-cookie';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '../../../api/auth/login';
import Alert from '../../../components/atoms/icon/Alert';
import Checkbox from '../../../components/atoms/input/Checkbox';

const Page = ({ data }: { data: string }) => {
  const router = useRouter();

  const [id, setId] = useState(data);
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
    if (saveId) return Cookies.remove('save_id');
    Cookies.set('save_id', id, {
      expires: 365 * 10,
    });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!id || !password) return;

    setLoading(true);
    await loginApi({ user_id: id, password }).then((res) => {
      if (res.message) return setMessage(res.message);

      setLoading(false);
      const {
        access_token,
        access_token_expired_at,
        refresh_token,
        refresh_token_expired_at,
      } = res.data;
      Cookies.set('access_token', access_token, {
        expires: new Date(access_token_expired_at),
      });
      Cookies.set('refresh_token', refresh_token, {
        expires: new Date(refresh_token_expired_at),
      });
      router.push('/admin/event');
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[440px] w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <img
                src="/dev_event_logo_darkmode_512.png"
                alt="데브 이벤트 로고"
                className="w-20 h-20 object-contain drop-shadow-xl"
                style={{
                  filter:
                    'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                }}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              데브 이벤트 어드민
            </h1>
            <p className="text-[15px] text-gray-600 font-medium">
              개발자 생태계를 발전시켜 나갑니다
            </p>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="id"
                  className="block text-[15px] font-bold text-gray-900 mb-2"
                >
                  아이디
                </label>
                <input
                  id="id"
                  type="text"
                  value={id}
                  onChange={changeId}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:border-[#3182F6] focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-[15px] font-semibold"
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-[15px] font-bold text-gray-900 mb-2"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={changePassword}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:border-[#3182F6] focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-[15px] font-semibold"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            {!message && loading && (
              <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-5 border-2 border-blue-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="animate-spin h-6 w-6 text-[#3182F6]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-[15px] font-bold text-[#3182F6]">
                      로그인 처리중입니다
                    </p>
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className="rounded-2xl bg-red-50 p-5 border-2 border-red-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Alert />
                  </div>
                  <div className="ml-4">
                    <p className="text-[15px] font-bold text-red-700">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center pt-2">
              <Checkbox
                checked={saveId}
                onChange={changeSaveId}
                label="아이디 저장"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-5 px-6 text-[17px] font-bold rounded-2xl text-white bg-gradient-to-r from-[#3182F6] to-[#4593FC] hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-lg shadow-blue-500/30"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Page;
