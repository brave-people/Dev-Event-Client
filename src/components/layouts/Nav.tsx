import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { EventRouter } from '../../model/Event';
import SettingIcon from '../atoms/icon/SettingIcon';

type ItemType = {
  path: EventRouter;
  title: string;
};

const navItems: (ItemType & { subItems?: ItemType[] })[] = [
  {
    path: '/admin/event',
    title: '개발자 행사 관리',
    subItems: [
      {
        path: '/admin/event/tag',
        title: '태그 관리',
      },
    ],
  },
  {
    path: '/admin/replay',
    title: '개발자 행사 다시보기 관리',
    subItems: [
      {
        path: '/admin/replay/tag',
        title: '태그 관리',
      },
    ],
  },
  {
    path: '/admin/groups',
    title: '개발자 모임 관리',
  },
];

const SubNav = ({
  subItems,
  isActive,
}: {
  subItems: ItemType[];
  isActive: (path: EventRouter) => boolean;
}) => (
  <ul>
    {subItems.map(({ path, title }) => (
      <li key={path}>
        <a
          href={path}
          className={classNames(
            'flex items-center rounded text-base my-1 py-2 px-10',
            {
              'text-blue-800 font-bold bg-blue-50': isActive(path),
            }
          )}
        >
          - {title}
        </a>
      </li>
    ))}
  </ul>
);

const Nav = () => {
  const { pathname } = useRouter();
  const isActive = (path: EventRouter) => path === pathname;

  return (
    <nav className="wrap__nav">
      <ul>
        {navItems.map(({ path, title, subItems }, index) => {
          return (
            <li key={path} className={classNames(index === 1 && 'my-4')}>
              <a
                href={path}
                className={classNames('flex items-center rounded p-2', {
                  'text-blue-800 font-bold bg-blue-50': isActive(path),
                })}
              >
                <SettingIcon />
                {title}
              </a>
              {subItems && <SubNav subItems={subItems} isActive={isActive} />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Nav;
