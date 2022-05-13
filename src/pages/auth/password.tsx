import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import getToken from '../../server/api/auth/getToken';
import { useUpdateCookie } from '../../util/use-cookie';
import Component from '../../components/auth/Password';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../model/User';

const queryClient = new QueryClient();

const Password = ({ token }: { token: TokenModel }) => {
  useEffect(() => {
    if (token) useUpdateCookie(document, token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component />
    </QueryClientProvider>
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

export default Password;
