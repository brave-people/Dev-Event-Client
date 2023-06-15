'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import UserModifyForm from '../../../../components/organisms/form/auth/Modify';
import UserComponent from '../../../../components/templates/User';
import { ResponseTokenModel } from '../../../../model/User';
import useRedirectRouter from '../../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return (
    <QueryClientProvider client={queryClient}>
      <UserComponent title="계정 수정">
        <UserModifyForm />
      </UserComponent>
    </QueryClientProvider>
  );
};

export default Client;
