import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPageContext } from 'next/types';
import getToken from '../../server/api/auth/getToken';

const SignOut = () => {
  const router = useRouter();
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');

  useEffect(() => {
    router.push('/auth/signIn');
  }, []);
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookie = context.req?.headers.cookie;
  const token = await getToken(cookie);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  return { props: {} };
};

export default SignOut;
