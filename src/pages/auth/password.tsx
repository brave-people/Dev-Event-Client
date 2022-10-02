import { QueryClient, QueryClientProvider } from 'react-query';
import getToken from '../../server/api/auth/getToken';
import UserComponent from '../../components/User';
import PasswordForm from '../../components/auth/form/Password';
import type { NextPageContext } from 'next/types';

const queryClient = new QueryClient();

const Password = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserComponent title="비밀번호 변경">
        <PasswordForm />
      </UserComponent>
    </QueryClientProvider>
  );
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

export default Password;
