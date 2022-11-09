import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { userAtom } from '../../../store/User';
import { getUsersProfileApi } from '../../../pages/api/auth/users/profile';

export const useUserProfile = () => {
  const [userState, setUserState] = useAtom(userAtom);

  const { data, refetch } = useQuery(
    ['fetchUsersProfile'],
    async () => await getUsersProfileApi(),
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (!userState.user_id && data) setUserState(data);
  }, []);

  return { data, refetch };
};
