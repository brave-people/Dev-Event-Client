import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ResponseTokenModel } from '../../model/User';

const useRedirectRouter = (token: ResponseTokenModel) => {
  const router = useRouter();

  useEffect(() => {
    if (!token || !token?.data || token?.error)
      return router.push('/auth/signIn');
  }, [token]);
};

export default useRedirectRouter;
