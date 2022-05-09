import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPageContext } from 'next/types';
import getToken from '../../server/api/auth/getToken';
import { useDeleteCookie } from '../../util/use-cookie';
import { baseRouter } from '../../config/constants';

const SignOut = () => {
  const router = useRouter();
  useEffect(() => {
    useDeleteCookie(document, 'access_token');
    useDeleteCookie(document, 'access_token_expired_at');
    useDeleteCookie(document, 'refresh_token');
    useDeleteCookie(document, 'refresh_token_expired_at');

    router.push(baseRouter() + '/auth/signIn');
  }, []);
};

export const getInitialProps = async (context: NextPageContext) => {
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

export default SignOut;
