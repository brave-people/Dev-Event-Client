import { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { stores } from '../store';
import { useUserProfile } from './auth/Profile';
import Header from './Header';
import Nav from './Nav';
import type { ReactElement } from 'react';

const Event = ({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) => {
  const layer = useRecoilValue(stores.layer);
  const { data: user } = useUserProfile();

  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Header user={user} />
      <main className="flex">
        <Nav />
        <section className="p-8 wrap__box--bg">
          <h1 className="mb-4 text-3xl font-bold">{title}</h1>
          {children}
          {layer && (
            <div className="bg-gray-300 block fixed top-0 left-0 opacity-60 w-full h-full" />
          )}
        </section>
      </main>
    </Suspense>
  );
};

export default Event;
