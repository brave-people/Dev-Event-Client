import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import stores from '../../store';
import User from '../../components/User';
import Input from '../../components/input/Input';
import getToken from '../../server/api/auth/getToken';
import { getUserRole } from '../../util/get-user-role';
import { useUpdateCookie } from '../../util/use-cookie';
import type { TokenModel } from '../../model/User';
import type { NextPageContext } from 'next/types';

const Modify = ({ token }: { token: TokenModel }) => {
  const user = useRecoilValue(stores.user);

  const [id, setId] = useState('');
  const [userName, setUserName] = useState('');
  const [hasModify, setHasModify] = useState(false);

  if (!user) return null;

  const roles = typeof user !== 'string' ? getUserRole(user.roles) : [];

  const changeId = (e: { target: { value: string } }) => {
    setId(e.target.value);
  };

  const changeUserName = (e: { target: { value: string } }) => {
    setUserName(e.target.value);
  };

  useEffect(() => {
    if (token) useUpdateCookie(document, token);
  }, []);

  return (
    <User title="회원정보수정">
      <form className="form--large">
        <div className="form__content">
          <Input
            text="아이디"
            value={id}
            onChange={() => changeId}
            isRequired={true}
            readonly={!hasModify}
          />
          <Input
            text="이름"
            value={userName}
            onChange={() => changeUserName}
            isRequired={true}
            readonly={!hasModify}
          />
          <Input
            text="이메일"
            value={userName}
            onChange={() => changeUserName}
            isRequired={true}
            readonly={!hasModify}
            type="email"
          />
          {roles.length > 0 && (
            <>
              <span className="form__content__title inline-block text-base font-medium text-gray-600">
                권한
              </span>
              {roles.map((role, index) => (
                <button key={index}>{role}</button>
              ))}
            </>
          )}
        </div>
        {!hasModify ? (
          <button onClick={() => setHasModify(true)}>수정</button>
        ) : (
          <button>저장</button>
        )}
      </form>
    </User>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  return { props: { token: token.data } };
};

export default Modify;
