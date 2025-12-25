import { useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { getHostsApi } from '../../../api/host';
import { deleteHostsApi } from '../../../api/host/delete';
import { HostResponse } from '../../../model/Host';
import { layerAtom } from '../../../store/layer';
import Alert from '../../molecules/Alert';

const HostList = () => {
  const router = useRouter();
  const [layer, setLayer] = useAtom(layerAtom);

  const divRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [maxHeight, setMaxHeight] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const button = buttonRefs.current[id];
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
      setOpenMenuId(id);
    }
  };

  const { data, refetch } = useQuery(
    ['fetchHosts'],
    async () => await getHostsApi(),
    { refetchOnWindowFocus: false }
  );

  const clickDeleteButton = (id: number) => {
    setCurrentId(id);
    setLayer(true);
  };

  const deleteHost = async () => {
    if (!currentId) return;
    await deleteHostsApi({ id: currentId });
    setLayer(false);
    await refetch();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!divRef.current) return;

    const divRefBottom = divRef.current.getBoundingClientRect().bottom;
    const top =
      divRef.current.clientHeight > window.innerHeight
        ? `calc(100vh - 72px)`
        : `${divRefBottom - 24}px`;
    setMaxHeight(top);
  }, [data]);

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
    <div ref={divRef} className="list">
      <div className="list__container">
        {!data?.length ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="list__empty-text">아직 등록된 주최가 없어요!</p>
          </div>
        ) : (
          <div className="list__table-wrapper">
            <table className="list__table">
              <thead>
                <tr>
                  <th className="list__table-header" style={{ width: '100px' }}>
                    No
                  </th>
                  <th className="list__table-header list__table-header--title">
                    주최명
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
                {data.map((value: HostResponse, index) => {
                  return (
                    <tr key={value.id} className="list__table-row">
                      <td className="list__table-cell list__table-cell--number">
                        {index + 1}
                      </td>
                      <td className="list__table-cell list__table-cell--title">
                        <span className="list__table-title-text">
                          {value.host_name}
                        </span>
                      </td>
                      <td className="list__table-cell list__table-cell--actions">
                        <div className="list__actions-menu">
                          <button
                            ref={(el) => (buttonRefs.current[value.id] = el)}
                            className="list__actions-menu-trigger"
                            aria-label="메뉴"
                            onClick={(e) => toggleMenu(e, value.id)}
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
                          {openMenuId === value.id && menuPosition && (
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
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    router.push(
                                      `/admin/host/modify?id=${value.id}`
                                    );
                                  }}
                                >
                                  수정
                                </button>
                                <button
                                  className="list__actions-dropdown-item list__actions-dropdown-item--delete"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    clickDeleteButton(value.id);
                                  }}
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

        {maxHeight && (
          <button
            type="button"
            className="list__create-button"
            onClick={() => router.push('/admin/host/create')}
            style={{ top: maxHeight }}
          >
            <svg
              className="list__create-button-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>주최 생성</span>
          </button>
        )}
      </div>

      {layer && (
        <Alert
          alertTitle="정말 삭제할까요?"
          alertDescription="돌이킬 수 없어요 🥲"
          toggleAlert={setLayer}
          onSave={deleteHost}
        />
      )}
    </div>
  );
};

export default HostList;
