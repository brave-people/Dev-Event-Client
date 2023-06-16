'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import UserForm from '../../../components/organisms/form/auth/Create';
import UserComponent from '../../../components/templates/User';
import type { ResponseTokenModel } from '../../../model/User';
import useRedirectRouter from '../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return (
    <QueryClientProvider client={queryClient}>
      <UserComponent title="계정 생성">
        <UserForm />
      </UserComponent>
    </QueryClientProvider>
  );
};

export default Client;
