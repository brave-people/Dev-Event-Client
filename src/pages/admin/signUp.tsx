import { useState } from "react";
import type { FormEvent } from "react";
import { registerUserApi } from "../api/auth/register";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const changeEmail = (e: { target: { value: string } }) => {
    setEmail(e.target.value);
  };

  const changePassword = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const changeName = (e: { target: { value: string } }) => {
    setName(e.target.value);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerUserApi({ email, password, name }).then((res) => {
      console.log(res);
    });
  };

  return (
    <section>
      <h2>용감한 관리자 회원가입</h2>
      <form onSubmit={submit}>
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={changeName}
        />
        <label htmlFor="email">아이디</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={changeEmail}
        />
        <label htmlFor="password">패스워드</label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={changePassword}
        />
        <button type="submit">가입</button>
      </form>
    </section>
  );
};

export default SignUp;
