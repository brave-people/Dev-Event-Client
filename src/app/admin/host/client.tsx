'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import HostList from '../../../components/organisms/host/List';
import EventComponent from '../../../components/templates/Event';
import type { ResponseTokenModel } from '../../../model/User';
import useRedirectRouter from '../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="주최 목록">
        <HostList />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
