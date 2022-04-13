import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import stores from '../../store';
import { getUsersProfileApi } from '../../pages/api/auth/profile';
import FormContent from './Form/Content';
import User from '../User';

const Info = () => {
  const { data } = useUserProfile();

  if (!data) return null;
  const { user_id: id, name, email, roles } = data;

  return (
    <User title="회원정보수정">
      <FormContent id={id} name={name} email={email} roles={roles} />
    </User>
  );
};

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

export default Info;
