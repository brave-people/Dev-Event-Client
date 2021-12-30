import { FormEvent, useState } from 'react';
import { loginApi } from '../api/login';

const SignIn = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const changeId = (e: { target: { value: string } }) => {
    setId(e.target.value);
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (id && password) {
      loginApi({ username: id, password }).then((res) => {
        console.log(res);
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
    </section>
  );
};

export default SignIn;
