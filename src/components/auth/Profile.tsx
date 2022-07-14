import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { stores } from '../../store';
import { getUsersProfileApi } from '../../pages/api/auth/users/profile';

export const useUserProfile = () => {
  const [userState, setUserState] = useRecoilState(stores.user);

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
