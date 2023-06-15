'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import EventList from '../../../components/organisms/event/List';
import EventComponent from '../../../components/templates/Event';
import type { ResponseTokenModel } from '../../../model/User';
import useRedirectRouter from '../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발자 행사 목록">
        <EventList />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
