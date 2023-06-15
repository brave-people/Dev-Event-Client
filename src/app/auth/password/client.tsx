'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import PasswordForm from '../../../components/organisms/form/auth/Password';
import UserComponent from '../../../components/templates/User';
import type { ResponseTokenModel } from '../../../model/User';
import useRedirectRouter from '../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return (
    <QueryClientProvider client={queryClient}>
      <UserComponent title="비밀번호 변경">
        <PasswordForm />
      </UserComponent>
    </QueryClientProvider>
  );
};

export default Client;
