'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import UsersComponent from '../../../components/organisms/auth/Users';
import UserComponent from '../../../components/templates/User';
import type { ResponseTokenModel } from '../../../model/User';
import useRedirectRouter from '../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return (
    <QueryClientProvider client={queryClient}>
      <UserComponent title="회원관리">
        <UsersComponent />
      </UserComponent>
    </QueryClientProvider>
  );
};

export default Client;
