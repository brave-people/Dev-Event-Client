import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useRedirectRouter = (token: { data: string; error: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    if (!token || token?.error) return router.push('/auth/signIn');
  }, [token]);
};

export default useRedirectRouter;
