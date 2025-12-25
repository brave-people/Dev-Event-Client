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
    <header className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/admin/event"
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                데브 이벤트
              </h1>
              <p className="text-xs text-gray-500 font-medium">Admin</p>
            </div>
          </Link>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
                <span className="text-blue-600 font-semibold text-sm">
                  {user?.name?.[0] || 'U'}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 hidden sm:block">
                {user?.name}
              </span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 translate-y-[-10px]"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 translate-y-[-10px]"
            >
              <Menu.Items className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden">
                <div className="p-2">
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      내 정보
                    </p>
                  </div>
                  <div className="py-1.5">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onClickModifyUser}
                          className={classNames(
                            active ? 'bg-blue-50' : '',
                            'group flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors'
                          )}
                        >
                          <div className={classNames(
                            active ? 'bg-blue-100' : 'bg-gray-100',
                            'w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors'
                          )}>
                            <svg
                              className={classNames(
                                active ? 'text-blue-600' : 'text-gray-600',
                                'w-4 h-4'
                              )}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </div>
                          <span>회원 정보 수정</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/auth/password"
                          className={classNames(
                            active ? 'bg-blue-50' : '',
                            'group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors'
                          )}
                        >
                          <div className={classNames(
                            active ? 'bg-blue-100' : 'bg-gray-100',
                            'w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors'
                          )}>
                            <svg
                              className={classNames(
                                active ? 'text-blue-600' : 'text-gray-600',
                                'w-4 h-4'
                              )}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <span>비밀번호 변경</span>
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </div>

                {isAdmin && (
                  <div className="p-2">
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        관리
                      </p>
                    </div>
                    <div className="py-1.5">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/auth/users"
                            className={classNames(
                              active ? 'bg-blue-50' : '',
                              'group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors'
                            )}
                          >
                            <div className={classNames(
                              active ? 'bg-blue-100' : 'bg-gray-100',
                              'w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors'
                            )}>
                              <svg
                                className={classNames(
                                  active ? 'text-blue-600' : 'text-gray-600',
                                  'w-4 h-4'
                                )}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                            </div>
                            <span>회원 관리</span>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/auth/create"
                            className={classNames(
                              active ? 'bg-blue-50' : '',
                              'group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors'
                            )}
                          >
                            <div className={classNames(
                              active ? 'bg-blue-100' : 'bg-gray-100',
                              'w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors'
                            )}>
                              <svg
                                className={classNames(
                                  active ? 'text-blue-600' : 'text-gray-600',
                                  'w-4 h-4'
                                )}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                              </svg>
                            </div>
                            <span>회원 생성</span>
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </div>
                )}

                <div className="p-2 border-t border-gray-100">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/auth/signOut"
                        className={classNames(
                          active ? 'bg-red-50' : '',
                          'group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors'
                        )}
                      >
                        <div className={classNames(
                          active ? 'bg-red-100' : 'bg-gray-100',
                          'w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors'
                        )}>
                          <svg
                            className={classNames(
                              active ? 'text-red-600' : 'text-gray-600',
                              'w-4 h-4'
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </div>
                        <span>로그아웃</span>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
