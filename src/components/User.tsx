import { Suspense } from 'react';
import { useUserProfile } from './auth/Profile';
import Header from './Header';
import Nav from './Nav';
import type { ReactElement } from 'react';

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
      <main className="flex">
        <Nav />
        <section className="p-8 wrap__box--bg">
          <h1 className="mb-4 text-3xl font-bold">{title}</h1>
          {children}
        </section>
      </main>
    </Suspense>
  );
};

export default User;
