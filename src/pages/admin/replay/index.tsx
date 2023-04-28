import { QueryClient, QueryClientProvider } from 'react-query';
import type { NextPageContext } from 'next/types';
import ReplayList from '../../../components/organisms/replay/List';
import EventComponent from '../../../components/templates/Event';
import getToken from '../../../server/api/auth/getToken';

const queryClient = new QueryClient();

const Replay = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발자 행사 다시보기">
        <ReplayList />
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

export default Replay;
