import { Suspense } from 'react';
import type { ReactElement } from 'react';
import Header from './Header';
import { useUserProfile } from './auth/Profile';

const User = ({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) => {
  const { data } = useUserProfile();
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Header user={data} />
      <h2>{title}</h2>
      {children}
    </Suspense>
  );
};

export default User;
