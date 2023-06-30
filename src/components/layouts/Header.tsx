import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import type { UsersModel, UserProfileModel } from '../../model/User';
import { selectedUserAtom } from '../../store/User';
import { getUserRoleIsAdmin } from '../../util/get-user-role';

const Header = ({ user }: { user?: UsersModel | UserProfileModel }) => {
  const router = useRouter();
  const setSelectedUser = useSetAtom(selectedUserAtom);

  const isAdmin = getUserRoleIsAdmin(user?.roles);

  const onClickModifyUser = () => {
    if (typeof user !== 'undefined') setSelectedUser(user);
    router.push('/auth/modify');
  };

  return (
    <header className="header">
      <Link href="/admin/event">
        <h1 className="text-3xl font-bold tracking-xl-tighter">
          용감한 관리자
        </h1>
      </Link>
      <Menu as="div" className="ml-3 relative">
        <div>
          <Menu.Button className="flex p-2 items-center bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 20 20"
              fill="#DEE1E5"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
            {user && (
              <p className="ml-1 mr-3 font-bold text-gray-600 text-sm">
                {user.name}
              </p>
            )}
            <svg
              className="w-5 h-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#687A92"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 p-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onClickModifyUser}
                  className={classNames(
                    active && 'bg-blue-50',
                    'w-full block px-4 py-2 text-sm text-left text-gray-500 rounded font-bold'
                  )}
                >
                  회원 정보 수정
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/auth/password"
                  className={classNames(
                    active && 'bg-blue-50',
                    'block px-4 py-2 text-sm text-gray-500 font-bold'
                  )}
                >
                  비밀번호 변경
                </Link>
              )}
            </Menu.Item>
            {isAdmin && (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/auth/users"
                      className={classNames(
                        active && 'bg-blue-50',
                        'block px-4 py-2 text-sm text-gray-500 font-bold'
                      )}
                    >
                      회원 관리
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/auth/create"
                      className={classNames(
                        active && 'bg-blue-50',
                        'block px-4 py-2 text-sm text-gray-500 font-bold'
                      )}
                    >
                      회원 생성
                    </Link>
                  )}
                </Menu.Item>
              </>
            )}
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/auth/signOut"
                  className={classNames(
                    active && 'bg-blue-50',
                    'block px-4 py-2 text-sm text-gray-500 font-bold'
                  )}
                >
                  로그아웃
                </Link>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </header>
  );
};

export default Header;
