import { QueryClient, QueryClientProvider } from 'react-query';
import type { NextPageContext } from 'next/types';
import getToken from '../../../server/api/auth/getToken';
import EventComponent from '../../../components/templates/Event';
import EventList from '../../../components/organisms/event/List';

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

export default Event;
