import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next/types';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { TokenModel } from '../../../model/User';
import getToken from '../../../server/api/auth/getToken';
import stores from '../../../store';
import EventComponent from '../../../components/Event';
import Calendar from '../../../components/event/Calendar';

const queryClient = new QueryClient();

function Admin({ data }: { data: TokenModel }) {
  const router = useRouter();
  const setUser = useSetRecoilState(stores.user);

  useEffect(() => {
    if (data) setUser(jwt.decode(data['access_token']));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent>
        <>
          <Calendar />
          <button
            type="button"
            onClick={() => router.push('/admin/event/create')}
          >
            이벤트 생성
          </button>
        </>
      </EventComponent>
    </QueryClientProvider>
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
