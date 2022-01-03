import { FormEvent, useState } from 'react';
import { loginApi } from '../api/login';
import { STATUS_200 } from '../../config/constants';

const SignIn = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const changeId = (e: { target: { value: string } }) => {
    setId(e.target.value);
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (id && password) {
      loginApi({ user_id: id, password }).then((res) => {
        if (res.status_code !== STATUS_200) {
          setMessage(res.message);
        }
      });
    }
  };

  return (
    <section>
      <h2>용감한 관리자</h2>
      <form onSubmit={submit}>
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
    </section>
  );
};

export default SignIn;
