import jwt, { JwtPayload } from 'jsonwebtoken';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import type { NextPageContext } from 'next/types';
import UserForm from '../../components/organisms/form/auth/Create';
import UserComponent from '../../components/templates/User';
import getToken from '../../server/api/auth/getToken';
import { getUserRoleIsAdmin } from '../../util/get-user-role';

const queryClient = new QueryClient();

const Create = ({ error }: { error: string }) => {
  const router = useRouter();

  useEffect(() => {
    if (error) {
      alert(error);
      router.push('/auth/signIn');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserComponent title="계정 생성">
        <UserForm />
      </UserComponent>
    </QueryClientProvider>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookie = context.req?.headers.cookie;
  const token = await getToken(cookie);

  if (cookie && (!token || token?.error)) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  const accessToken = jwt.decode(token?.data?.access_token) as JwtPayload;
  if (!token?.data && !getUserRoleIsAdmin(accessToken?.roles)) {
    return {
      props: {
        error: '관리자만 계정을 생성할 수 있어요!',
      },
    };
  }

  return { props: {} };
};

export default Create;
