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
      <section className="p-8 wrap__box--bg">
        <h1 className="mb-4 text-3xl font-bold">{title}</h1>
        {children}
      </section>
    </Suspense>
  );
};

export default User;
