import { Suspense } from 'react';
import type { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import Header from './Header';
import stores from '../store';

const Event = ({ children }: { children: ReactElement }) => {
  const user = useRecoilValue(stores.user);
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Header user={user} />
      {children}
    </Suspense>
  );
};

export default Event;
