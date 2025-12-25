import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { useRef, useState, useEffect } from 'react';
import { deleteUsersApi, getUsersApi } from '../../../api/auth/users';
import type { UsersModel } from '../../../model/User';
import { userAtom, selectedUserAtom } from '../../../store/User';
import { getConvertAuthType } from '../../../util/get-convert-auth-type';
import { getUserRole } from '../../../util/get-user-role';
import { getUserRoleIsAdmin } from '../../../util/get-user-role';

const Users = () => {
  const router = useRouter();
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const { data, refetch } = useQuery(
    ['fetchUsers'],
    async () => await getUsersApi(),
    {
      refetchOnWindowFocus: false,
    }
  );
  const [user] = useAtom(userAtom);
  const [, setSelectedUser] = useAtom(selectedUserAtom);
  const isAdmin = getUserRoleIsAdmin(user?.roles);

  const toggleMenu = (e: React.MouseEvent, userNo: number) => {
    e.stopPropagation();

    if (openMenuId === userNo) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const button = buttonRefs.current[userNo];
      if (button) {
        const rect = button.getBoundingClientRect();
        const dropdownWidth = 120;
        const rightMargin = 16;

        let left = rect.right - dropdownWidth;

        if (left + dropdownWidth > window.innerWidth - rightMargin) {
          left = window.innerWidth - rightMargin - dropdownWidth;
        }

        setMenuPosition({
          top: rect.bottom + 4,
          left: left,
        });
      }
      setOpenMenuId(userNo);
    }
  };

  const clickModifyUser = (user: UsersModel) => {
    setOpenMenuId(null);
    setSelectedUser(user);
    router.push('/auth/users/modify');
  };

  const clickDeleteUser = async (user: UsersModel) => {
    if (!isAdmin) return alert('관리자만 삭제할 수 있어요!');
    setOpenMenuId(null);
    const body = {
      auth_type: user.auth_type,
      user_id: user.user_id,
    };
    await deleteUsersApi({ data: body });
    alert('계정 삭제에 성공하였어요!');
    await refetch();
  };

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('.list__actions-menu') &&
        !target.closest('.list__actions-dropdown')
      ) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 스크롤 시 메뉴 닫기
  useEffect(() => {
    const handleScroll = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openMenuId]);

  return (
    <div className="list">
      <div className="list__container">
        {!data || !data.length ? (
          <div className="list__empty">
            <svg
              className="list__empty-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="list__empty-text">아직 사용자가 없어요!</p>
          </div>
        ) : (
          <div className="list__table-wrapper">
            <table className="list__table">
              <thead>
                <tr>
                  <th className="list__table-header" style={{ width: '80px' }}>
                    No
                  </th>
                  <th className="list__table-header" style={{ minWidth: '130px' }}>
                    아이디
                  </th>
                  <th className="list__table-header list__table-header--title" style={{ minWidth: '130px' }}>
                    이메일
                  </th>
                  <th className="list__table-header" style={{ minWidth: '140px' }}>
                    회원유형
                  </th>
                  <th className="list__table-header" style={{ minWidth: '230px' }}>
                    권한
                  </th>
                  <th className="list__table-header" style={{ width: '180px' }}>
                    최초 발급일
                  </th>
                  <th
                    className="list__table-header list__table-header--actions"
                    style={{ width: '100px' }}
                  >
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((userItem, index) => {
                  return (
                    <tr key={`${userItem.email}_${index}`} className="list__table-row">
                      <td className="list__table-cell list__table-cell--number">
                        {userItem.user_no}
                      </td>
                      <td className="list__table-cell">{userItem.user_id}</td>
                      <td className="list__table-cell list__table-cell--title">
                        <span className="list__table-title-text">
                          {userItem.email}
                        </span>
                      </td>
                      <td className="list__table-cell">
                        {getConvertAuthType(userItem.auth_type)}
                      </td>
                      <td className="list__table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {getUserRole(userItem.roles).map((role, roleIndex) => (
                            <span
                              key={roleIndex}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="list__table-cell list__table-cell--date">
                        {dayjs(userItem.create_dt).format('YYYY-MM-DD HH:mm')}
                      </td>
                      <td className="list__table-cell list__table-cell--actions">
                        <div className="list__actions-menu">
                          <button
                            ref={(el) =>
                              (buttonRefs.current[userItem.user_no] = el)
                            }
                            className="list__actions-menu-trigger"
                            aria-label="메뉴"
                            onClick={(e) => toggleMenu(e, userItem.user_no)}
                          >
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                          {openMenuId === userItem.user_no && menuPosition && (
                            <div
                              className="list__actions-dropdown"
                              style={{
                                display: 'block',
                                position: 'fixed',
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                                zIndex: 10000,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="list__actions-dropdown-wrapper">
                                <button
                                  className="list__actions-dropdown-item list__actions-dropdown-item--edit"
                                  onClick={() => clickModifyUser(userItem)}
                                >
                                  수정
                                </button>
                                <button
                                  className="list__actions-dropdown-item list__actions-dropdown-item--delete"
                                  onClick={() => clickDeleteUser(userItem)}
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
