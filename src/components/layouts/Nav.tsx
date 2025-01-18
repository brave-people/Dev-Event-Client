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
  <ul className="ml-6 border-l border-gray-200">
    {subItems.map(({ path, title }) => (
      <li key={path}>
        <a
          href={path}
          className={classNames(
            'flex items-center text-[13px] py-2 pl-4 -ml-px',
            {
              'text-blue-600 border-l-2 border-blue-600 bg-blue-50 font-medium':
                isActive(path),
              'text-gray-600 hover:text-gray-900 hover:border-l-2 hover:border-gray-300':
                !isActive(path),
            }
          )}
        >
          {title}
        </a>
      </li>
    ))}
  </ul>
);

const Nav = () => {
  const pathname = usePathname();
  const isActive = (path: EventRouter) => path === pathname;

  return (
    <nav className="w-80 min-h-screen bg-white border-r border-gray-200">
      <ul className="py-3 px-5">
        {navItems.map(({ path, title, subItems }, index) => (
          <li key={path} className={classNames('mb-1', index === 1 && 'mb-4')}>
            <a
              href={path}
              className={classNames(
                'flex items-center text-[14px] px-3 py-2 rounded-md transition-colors duration-150',
                {
                  'text-blue-600 bg-blue-50 font-medium': isActive(path),
                  'text-gray-700 hover:bg-gray-50': !isActive(path),
                }
              )}
            >
              <Setting />
              {title}
            </a>
            {subItems && <SubNav subItems={subItems} isActive={isActive} />}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
