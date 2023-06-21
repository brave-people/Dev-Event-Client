'use client';

import Cookies from 'js-cookie';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '../../../api/auth/login';
import Alert from '../../../components/atoms/icon/Alert';
import Checkbox from '../../../components/atoms/input/Checkbox';
import Input from '../../../components/atoms/input/Input';

type FormDataType = {
  id: string;
  password: string;
  isIdSaved: boolean;
  message: string;
  loading: boolean;
};

const Page = ({ data }: { data: string }) => {
  const router = useRouter();

  const [{ id, password, isIdSaved, message, loading }, setFormData] =
    useState<FormDataType>({
      id: data,
      password: '',
      isIdSaved: !!data,
      message: '',
      loading: false,
    });

  const changeFormData = <K extends keyof FormDataType>(
    key: K,
    value: FormDataType[K]
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const changeId = (e: { target: { value: string } }) => {
    changeFormData('id', e.target.value);
  };

  const changePassword = (e: { target: { value: string } }) => {
    changeFormData('password', e.target.value);
  };

  const changeIsIdSaved = () => {
    const updatedIsIdSaved = !isIdSaved;
    changeFormData('isIdSaved', updatedIsIdSaved);

    if (updatedIsIdSaved) {
      Cookies.remove('save_id');
    } else {
      Cookies.set('save_id', id, {
        expires: 365 * 10,
      });
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changeFormData('message', '');

    if (!id || !password) return;

    changeFormData('loading', true);
    await loginApi({ user_id: id, password }).then((res) => {
      if (res.message) return changeFormData('message', res.message);

      changeFormData('loading', false);
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
              <Alert />
              {message}
            </p>
          )}
          <div className="checkbox--blue mb-4">
            <Checkbox
              checked={isIdSaved}
              onChange={changeIsIdSaved}
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

export default Page;
