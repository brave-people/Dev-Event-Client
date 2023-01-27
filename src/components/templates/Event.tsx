import { Suspense } from 'react';
import { useAtomValue } from 'jotai';
import { layerAtom } from '../../store/layer';
import { useUserProfile } from '../organisms/auth/Profile';
import Header from '../layouts/Header';
import Nav from '../layouts/Nav';
import type { ReactElement } from 'react';

const BackgroundBox = () => {
  return (
    <div className="z-10 bg-gray-300 block fixed top-0 left-0 opacity-60 w-full h-full" />
  );
};

const Event = ({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) => {
  const layer = useAtomValue(layerAtom);
  const { data: user } = useUserProfile();

  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Header user={user} />
      <main className="flex">
        <Nav />
        <section className="p-8 wrap__box--bg">
          <h1 className="mb-4 text-3xl font-bold">{title}</h1>
          {layer && <BackgroundBox />}
          {children}
        </section>
      </main>
    </Suspense>
  );
};

export default Event;
