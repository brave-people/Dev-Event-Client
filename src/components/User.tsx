import { Suspense } from 'react';
import type { ReactElement } from 'react';
import Header from './Header';
import { useRecoilValue } from 'recoil';
import stores from '../store';

const User = ({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) => {
  const user = useRecoilValue(stores.user);
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Header user={user} />
      <h2>{title}</h2>
      {children}
    </Suspense>
  );
};

export default User;
