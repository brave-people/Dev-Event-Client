import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import getToken from '../../../server/api/auth/getToken';
import { useUpdateCookie } from '../../../util/use-cookie';
import EventComponent from '../../../components/templates/Event';
import ReplayList from '../../../components/organisms/form/replay/List';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';

const queryClient = new QueryClient();

const Replay = (data: { token: TokenModel }) => {
  const { token } = data || {};

  useEffect(() => {
    if (token?.access_token) useUpdateCookie(document, token);
  }, []);

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

  return { props: { token: token.data } };
};

export default Replay;
