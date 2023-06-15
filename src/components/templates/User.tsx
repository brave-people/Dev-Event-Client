import { Suspense } from 'react';
import type { ReactElement } from 'react';
import Header from '../layouts/Header';
import Nav from '../layouts/Nav';
import { useUserProfile } from '../organisms/auth/Profile';

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
