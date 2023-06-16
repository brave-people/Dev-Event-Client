'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import ReplayList from '../../../components/organisms/replay/List';
import EventComponent from '../../../components/templates/Event';
import { ResponseTokenModel } from '../../../model/User';
import useRedirectRouter from '../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발자 행사 다시보기">
        <ReplayList />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
