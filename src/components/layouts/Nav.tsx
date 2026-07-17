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
    subItems: [{ path: '/admin/event/tag', title: '태그 관리' }],
  },
  {
    path: '/admin/replay',
    title: '다시보기 관리',
    subItems: [{ path: '/admin/replay/tag', title: '태그 관리' }],
  },
  { path: '/admin/host', title: '행사 주최 관리' },
  { path: '/admin/banner', title: '최상단 배너 관리' },
];

const SubNav = ({
  subItems,
  isActive,
}: {
  subItems: ItemType[];
  isActive: (path: EventRouter) => boolean;
}) => (
  <ul className="admin-nav__submenu">
    {subItems.map(({ path, title }) => (
      <li key={path}>
        <a
          href={path}
          aria-current={isActive(path) ? 'page' : undefined}
          className={classNames('admin-nav__sublink', {
            'admin-nav__sublink--active': isActive(path),
          })}
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
    if (subItems?.some((subItem) => pathname.startsWith(subItem.path))) {
      return false;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="admin-nav" aria-label="주요 메뉴">
      <p className="admin-nav__label">콘텐츠 관리</p>
      <ul className="admin-nav__list">
        {navItems.map(({ path, title, subItems }) => {
          const active = isParentActive(path, subItems);

          return (
            <li key={path} className="admin-nav__item">
              <a
                href={path}
                aria-current={active ? 'page' : undefined}
                className={classNames('admin-nav__link', {
                  'admin-nav__link--active': active,
                })}
              >
                <Setting />
                <span>{title}</span>
              </a>
              {subItems && (
                <SubNav subItems={subItems} isActive={isSubItemActive} />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Nav;
