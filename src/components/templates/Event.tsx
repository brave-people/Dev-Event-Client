import type { ReactElement } from 'react';
import { useAtomValue } from 'jotai';
import { layerAtom } from '../../store/layer';
import Header from '../layouts/Header';
import Nav from '../layouts/Nav';
import { useUserProfile } from '../organisms/auth/Profile';

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
    <>
      <Header user={user} />
      <main className="flex">
        <Nav />
        <section className="p-8 wrap__box--bg">
          <h1 className="mb-4 text-3xl font-bold">{title}</h1>
          {layer && <BackgroundBox />}
          {children}
        </section>
      </main>
    </>
  );
};

export default Event;
