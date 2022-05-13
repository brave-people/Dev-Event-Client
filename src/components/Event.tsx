import { Suspense } from 'react';
import Header from './Header';
import { useUserProfile } from './auth/Modify';
import type { ReactElement } from 'react';

const Event = ({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) => {
  const { data: user } = useUserProfile();

  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Header user={user} />
      <h1 className="text-3xl font-bold">{title}</h1>
      {children}
    </Suspense>
  );
};

export default Event;
