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
    <header className="admin-header">
      <div className="admin-header__inner">
        <Link href="/admin/event" className="admin-header__brand">
          <span className="admin-header__mark" aria-hidden="true">
            D
          </span>
          <span className="admin-header__brand-copy">
            <strong>데브 이벤트</strong>
            <small>Admin</small>
          </span>
        </Link>

        <Menu as="div" className="admin-account">
          <Menu.Button className="admin-account__button">
            <span className="admin-account__avatar" aria-hidden="true">
              {user?.name?.[0] || 'U'}
            </span>
            <span className="admin-account__name">
              {user?.name || '관리자'}
            </span>
            <svg
              className="admin-account__chevron"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="admin-account-menu">
              <div className="admin-account-menu__section">
                <p className="admin-account-menu__label">내 정보</p>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={onClickModifyUser}
                      className={classNames('admin-account-menu__item', {
                        'admin-account-menu__item--active': active,
                      })}
                    >
                      <span className="admin-account-menu__icon" aria-hidden>
                        <svg
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
                      </span>
                      회원 정보 수정
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/auth/password"
                      className={classNames('admin-account-menu__item', {
                        'admin-account-menu__item--active': active,
                      })}
                    >
                      <span className="admin-account-menu__icon" aria-hidden>
                        <svg
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
                      </span>
                      비밀번호 변경
                    </Link>
                  )}
                </Menu.Item>
              </div>

              {isAdmin && (
                <div className="admin-account-menu__section">
                  <p className="admin-account-menu__label">관리</p>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/auth/users"
                        className={classNames('admin-account-menu__item', {
                          'admin-account-menu__item--active': active,
                        })}
                      >
                        <span className="admin-account-menu__icon" aria-hidden>
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </span>
                        회원 관리
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/auth/create"
                        className={classNames('admin-account-menu__item', {
                          'admin-account-menu__item--active': active,
                        })}
                      >
                        <span className="admin-account-menu__icon" aria-hidden>
                          <svg
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
                        </span>
                        회원 생성
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              )}

              <div className="admin-account-menu__section admin-account-menu__section--logout">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/auth/signOut"
                      className={classNames(
                        'admin-account-menu__item admin-account-menu__item--danger',
                        { 'admin-account-menu__item--active': active }
                      )}
                    >
                      <span className="admin-account-menu__icon" aria-hidden>
                        <svg
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
                      </span>
                      로그아웃
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
