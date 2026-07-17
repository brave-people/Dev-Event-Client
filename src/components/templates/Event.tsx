import type { ReactElement } from 'react';
import { useAtomValue } from 'jotai';
import { layerAtom } from '../../store/layer';
import Header from '../layouts/Header';
import Nav from '../layouts/Nav';
import { useUserProfile } from '../organisms/auth/Profile';

const BackgroundBox = () => {
  return <div className="admin-backdrop" aria-hidden="true" />;
};

const Event = ({
  title,
  eyebrow = 'CONTENT MANAGEMENT',
  description,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactElement;
}) => {
  const layer = useAtomValue(layerAtom);
  const { data: user } = useUserProfile();

  return (
    <div className="admin-shell">
      <Header user={user} />
      <div className="admin-layout">
        <Nav />
        <main className="admin-content">
          <div className="admin-content__inner">
            <div className="admin-page-heading">
              <p className="admin-page-heading__eyebrow">{eyebrow}</p>
              <h1 className="admin-page-heading__title">{title}</h1>
              {description && (
                <p className="admin-page-heading__description">{description}</p>
              )}
            </div>
            {layer && <BackgroundBox />}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Event;
