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
    title: '다시보기 관리',
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
  <ul className="mt-1.5 space-y-1 ml-5">
    {subItems.map(({ path, title }) => (
      <li key={path}>
        <a
          href={path}
          aria-current={isActive(path) ? 'page' : undefined}
          className={classNames(
            'block text-[14px] py-2 px-3.5 rounded-lg font-semibold transition-all duration-300',
            {
              'text-white bg-gradient-to-r from-[#3182F6] to-[#4593FC] shadow-md shadow-blue-500/25 -translate-y-0.5':
                isActive(path),
              'text-gray-600 hover:text-[#3182F6] hover:bg-blue-50 hover:-translate-y-0.5':
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
  
  const isSubItemActive = (path: EventRouter) => pathname.startsWith(path);
  
  const isParentActive = (path: EventRouter, subItems?: ItemType[]) => {
    // 서브 아이템이 있는 경우, 서브 아이템 중 하나라도 활성화되면 부모는 비활성화
    if (subItems) {
      const hasActiveSubItem = subItems.some(subItem => 
        pathname.startsWith(subItem.path)
      );
      if (hasActiveSubItem) return false;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav
      className="w-[240px] min-w-[240px] flex-shrink-0 min-h-screen bg-white border-r border-gray-100"
      aria-label="주요 메뉴"
    >
      <div className="py-6 px-3">
        <ul className="space-y-1.5">
          {navItems.map(({ path, title, subItems }) => (
            <li key={path}>
              <a
                href={path}
                aria-current={isParentActive(path, subItems) ? 'page' : undefined}
                className={classNames(
                  'flex items-center gap-2.5 text-[15px] py-2.5 px-4 rounded-xl font-bold transition-all duration-300',
                  {
                    'text-white bg-gradient-to-r from-[#3182F6] to-[#4593FC] shadow-lg shadow-blue-500/30 -translate-y-0.5':
                      isParentActive(path, subItems),
                    'text-gray-800 hover:text-[#3182F6] hover:bg-blue-50 hover:-translate-y-0.5':
                      !isParentActive(path, subItems),
                  }
                )}
              >
                <Setting />
                <span className="leading-tight">{title}</span>
              </a>
              {subItems && <SubNav subItems={subItems} isActive={isSubItemActive} />}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
