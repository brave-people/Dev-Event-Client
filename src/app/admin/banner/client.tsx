'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BannerList from '../../../components/organisms/banner/List';
import EventComponent from '../../../components/templates/Event';
import type { ResponseTokenModel } from '../../../model/User';
import useRedirectRouter from '../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="최상단 메인 최상단 배너 목록">
        <BannerList />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
