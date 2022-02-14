import type { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import Header from './event/Header';
import stores from '../store';

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
