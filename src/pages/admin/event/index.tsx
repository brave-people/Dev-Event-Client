import { QueryClient, QueryClientProvider } from 'react-query';
import type { NextPageContext } from 'next/types';
import getToken from '../../../server/api/auth/getToken';
import EventComponent from '../../../components/Event';
import EventList from '../../../components/event/List';

const queryClient = new QueryClient();

const Event = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발자 행사 목록">
        <EventList />
      </EventComponent>
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

export default Event;
