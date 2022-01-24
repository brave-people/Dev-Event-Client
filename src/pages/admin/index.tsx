import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import jwt from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next/types';
import type { TokenModel } from '../../model/User';
import getToken from '../../server/api/auth/getToken';
import stores from '../../store';
import Header from '../../components/Header';
import Calendar from '../../components/Calendar';

function Admin({ data }: { data: TokenModel }) {
  const [user, setUser] = useRecoilState(stores.user);

  useEffect(() => {
    setUser(jwt.decode(data['access_token']));
  }, []);

  return (
    <div>
      <Header user={user} />
      <Calendar />
    </div>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = context.req.headers.cookie;
  const token = await getToken(cookies);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  return { props: token };
};

export default Admin;
