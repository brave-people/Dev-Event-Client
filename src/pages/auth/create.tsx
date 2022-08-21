import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { QueryClient, QueryClientProvider } from 'react-query';
import getToken from '../../server/api/auth/getToken';
import { useUpdateCookie } from '../../util/use-cookie';
import { getUserRoleIsAdmin } from '../../util/get-user-role';
import UserComponent from '../../components/User';
import UserForm from '../../components/auth/form/Create';
import type { NextPageContext } from 'next/types';
import type { ResponseTokenModel } from '../../model/User';

const queryClient = new QueryClient();

const Create = ({ data, error }: ResponseTokenModel) => {
  const router = useRouter();

  useEffect(() => {
    if (error) {
      alert(error);
      router.push('/auth/signIn');
    }
    if (data?.access_token) useUpdateCookie(document, data);
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
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);

  if (cookies && (!token || token?.error)) {
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

  return { props: token };
};

export default Create;
