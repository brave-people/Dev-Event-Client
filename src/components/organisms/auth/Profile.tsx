import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAtom } from 'jotai';
import { getUsersProfileApi } from '../../../api/auth/users/profile';
import { userAtom } from '../../../store/User';

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
