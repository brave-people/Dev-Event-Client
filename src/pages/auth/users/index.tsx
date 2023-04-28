import { QueryClient, QueryClientProvider } from 'react-query';
import type { NextPageContext } from 'next/types';
import UsersComponent from '../../../components/organisms/auth/Users';
import UserComponent from '../../../components/templates/User';
import getToken from '../../../server/api/auth/getToken';

const queryClient = new QueryClient();

const Users = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserComponent title="회원관리">
        <UsersComponent />
      </UserComponent>
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

  return { props: {} };
};

export default Users;
