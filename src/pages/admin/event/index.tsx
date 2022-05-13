import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import getToken from '../../../server/api/auth/getToken';
import EventComponent from '../../../components/Event';
import List from '../../../components/event/List';
import { useUpdateCookie } from '../../../util/use-cookie';

const queryClient = new QueryClient();

const EventList = ({ token }: { token: TokenModel }) => {
  const router = useRouter();

  useEffect(() => {
    if (token) useUpdateCookie(document, token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent>
        <>
          <List />
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

export default EventList;
