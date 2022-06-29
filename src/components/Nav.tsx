import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { EventRouter } from '../model/Event';

const CogSvgIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Nav = () => {
  const { pathname } = useRouter();
  const currentRouter = (path: EventRouter) => path === pathname;

  return (
    <nav className="wrap__nav">
      <ul>
        <li>
          <a
            href="/admin/event"
            className={classNames('flex items-center rounded p-2', {
              'text-blue-800 font-bold bg-blue-50':
                currentRouter('/admin/event'),
            })}
          >
            <CogSvgIcon />
            개발자 행사 관리
          </a>
        </li>
        <li className="my-4">
          <a
            href="/admin/replay"
            className={classNames('flex items-center rounded p-2', {
              'text-blue-800 font-bold bg-blue-50':
                currentRouter('/admin/replay'),
            })}
          >
            <CogSvgIcon />
            개발자 행사 다시보기 관리
          </a>
        </li>
        <li>
          <a
            href="/admin/groups"
            className={classNames('flex items-center rounded p-2', {
              'text-blue-800 font-bold bg-blue-50':
                currentRouter('/admin/groups'),
            })}
          >
            <CogSvgIcon />
            개발자 모임 관리
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
