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
      if (res.message) {
        setLoading(false);
        return setMessage(res.message);
      }

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
    <main className="login-page">
      <aside className="login-hero" aria-label="데브 이벤트 소개">
        <div className="login-hero__brand">
          <img
            src="/dev_event_logo_darkmode_512.png"
            alt=""
            className="login-hero__logo"
          />
          <span>DEV EVENT ADMIN</span>
        </div>

        <div className="login-hero__content">
          <p className="login-panel__eyebrow">개발자 행사를 한곳에서</p>
          <h2 className="login-hero__title">데브 이벤트</h2>
          <p className="login-hero__description">
            개발자에게 필요한 행사를 더 빠르고 정확하게 전달할 수 있도록
            콘텐츠를 관리합니다.
          </p>
        </div>

        <p className="login-hero__footer">개발자 생태계를 발전시켜 나갑니다.</p>
      </aside>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-panel__inner">
          <div className="login-panel__mobile-brand" aria-hidden="true">
            <img src="/dev_event_logo_darkmode_512.png" alt="" />
            <span>DEV EVENT ADMIN</span>
          </div>

          <p className="login-panel__eyebrow">관리자 전용</p>
          <h1 id="login-title" className="login-panel__title">
            로그인
          </h1>
          <p className="login-panel__description">
            등록된 관리자 계정으로 로그인해 주세요.
          </p>

          <form className="login-form" onSubmit={submit}>
            <div className="login-form__fields">
              <div className="login-form__field">
                <label htmlFor="id" className="login-form__label">
                  아이디
                </label>
                <input
                  id="id"
                  type="text"
                  value={id}
                  onChange={changeId}
                  required
                  autoComplete="username"
                  className="login-form__input"
                  placeholder="아이디를 입력하세요"
                />
              </div>

              <div className="login-form__field">
                <label htmlFor="password" className="login-form__label">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={changePassword}
                  required
                  autoComplete="current-password"
                  className="login-form__input"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            {!message && loading && (
              <p
                className="login-form__status login-form__status--loading"
                role="status"
              >
                <span className="login-form__spinner" aria-hidden="true" />
                로그인 처리 중입니다.
              </p>
            )}

            {message && (
              <p
                className="login-form__status login-form__status--error"
                role="alert"
              >
                <Alert />
                <span>{message}</span>
              </p>
            )}

            <div className="login-form__options">
              <Checkbox
                checked={saveId}
                onChange={changeSaveId}
                label="아이디 저장"
              />
            </div>

            <button
              type="submit"
              className="login-form__submit"
              disabled={loading}
            >
              {loading ? '로그인 중' : '로그인'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Page;
