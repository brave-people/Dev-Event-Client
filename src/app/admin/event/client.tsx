'use client';

import type { ResponseTokenModel } from '../../../model/User';
import useRedirectRouter from '../../../util/hooks/use-redirect-router';

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  return <div>test</div>;
};

export default Client;
