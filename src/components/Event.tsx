import Header from './event/Header';
import { useRecoilValue } from 'recoil';
import stores from '../store';
import type { ReactElement } from 'react';

const Event = ({ children }: { children?: ReactElement }) => {
  const user = useRecoilValue(stores.user);

  return (
    <>
      <Header user={user} />
      {children && { ...children }}
    </>
  );
};

export default Event;
