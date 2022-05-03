import { Suspense } from 'react';
import type { ReactElement } from 'react';
import Header from './Header';
import { useUserProfile } from './auth/Modify';

const Event = ({ children }: { children: ReactElement }) => {
  const { data: user } = useUserProfile();

  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Header user={user} />
      {children}
    </Suspense>
  );
};

export default Event;
