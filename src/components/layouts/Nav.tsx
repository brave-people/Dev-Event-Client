import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import type { EventRouter } from '../../model/Event';
import Setting from '../atoms/icon/Setting';

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
    path: '/admin/host',
    title: '행사 주최 관리',
  },
  {
    path: '/admin/banner',
    title: '최상단 배너 관리',
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
  const pathname = usePathname();
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
                <Setting />
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
