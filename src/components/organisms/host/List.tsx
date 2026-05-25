import { useEffect, useMemo, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { getHostsApi } from '../../../api/host';
import { deleteHostsApi } from '../../../api/host/delete';
import type { HostClassification, HostResponse } from '../../../model/Host';
import { layerAtom } from '../../../store/layer';
import HostClassificationBadge from '../../atoms/HostClassificationBadge';
import Toggle from '../../atoms/Toggle';
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

  const [q, setQ] = useState('');
  const [filterClass, setFilterClass] = useState<HostClassification | 'ALL'>(
    'ALL'
  );

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

  const filtered = useMemo(() => {
    if (!data) return [];
    const sorted = [...data].sort((a, b) => {
      const ao = a.display_order ?? 0;
      const bo = b.display_order ?? 0;
      if (bo !== ao) return bo - ao;
      return a.host_name.localeCompare(b.host_name, 'ko');
    });
    return sorted.filter((h) => {
      const qq = q.trim().toLowerCase();
      const matchQ = qq === '' || h.host_name.toLowerCase().includes(qq);
      const matchClass =
        filterClass === 'ALL' || h.classification === filterClass;
      return matchQ && matchClass;
    });
  }, [data, q, filterClass]);

  const verifiedCount = useMemo(
    () => (data ?? []).filter((h) => h.verified === true).length,
    [data]
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
          <>
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
              <span>
                전체 <strong className="text-gray-900">{data.length}</strong>건
                · 인증{' '}
                <strong className="text-gray-900">{verifiedCount}</strong>건
              </span>
              <div className="ml-auto flex gap-2">
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="주최명 검색…"
                  className="appearance-none w-64 h-10 px-3 border rounded border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <select
                  value={filterClass}
                  onChange={(e) =>
                    setFilterClass(e.target.value as HostClassification | 'ALL')
                  }
                  className="appearance-none h-10 pl-3 pr-8 border rounded border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-no-repeat bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%200%201%201.06.02L10%2011.06l3.71-3.83a.75.75%200%201%201%201.08%201.04l-4.25%204.39a.75.75%200%200%201-1.08%200L5.21%208.27a.75.75%200%200%201%20.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]"
                >
                  <option value="ALL">전체 분류</option>
                  <option value="COMPANY">회사</option>
                  <option value="COMMUNITY">커뮤니티</option>
                  <option value="ACADEMIC">학회/학술</option>
                  <option value="GOVERNMENT">정부/공공</option>
                  <option value="EDUCATION">교육기관</option>
                  <option value="MEDIA">미디어</option>
                </select>
              </div>
            </div>

            <div className="list__table-wrapper">
              <table className="list__table">
                <thead>
                  <tr>
                    <th
                      className="list__table-header"
                      style={{ width: '60px' }}
                    >
                      No
                    </th>
                    <th className="list__table-header list__table-header--title">
                      주최명
                    </th>
                    <th
                      className="list__table-header"
                      style={{ width: '120px' }}
                    >
                      분류
                    </th>
                    <th
                      className="list__table-header"
                      style={{ width: '160px' }}
                    >
                      활동 분야
                    </th>
                    <th
                      className="list__table-header"
                      style={{ width: '140px' }}
                    >
                      활동 지역
                    </th>
                    <th
                      className="list__table-header"
                      style={{ width: '80px' }}
                    >
                      인증
                    </th>
                    <th
                      className="list__table-header"
                      style={{ width: '80px' }}
                    >
                      순서
                    </th>
                    <th
                      className="list__table-header list__table-header--actions"
                      style={{ width: '80px' }}
                    >
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="list__table-cell text-center text-gray-400 py-6"
                      >
                        검색 결과가 없어요.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((value: HostResponse, index) => (
                      <tr key={value.id} className="list__table-row">
                        <td className="list__table-cell list__table-cell--number">
                          {index + 1}
                        </td>
                        <td className="list__table-cell list__table-cell--title">
                          <div className="flex items-center gap-2">
                            {value.image_link ? (
                              <img
                                src={value.image_link}
                                alt=""
                                className="w-7 h-7 rounded object-cover"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded bg-gray-100 inline-block" />
                            )}
                            <span className="list__table-title-text">
                              {value.host_name}
                            </span>
                          </div>
                        </td>
                        <td className="list__table-cell">
                          <HostClassificationBadge
                            value={value.classification ?? null}
                          />
                        </td>
                        <td className="list__table-cell">
                          {value.domain ?? '—'}
                        </td>
                        <td className="list__table-cell">
                          {value.meta_location ?? '—'}
                        </td>
                        <td className="list__table-cell">
                          <Toggle
                            checked={value.verified === true}
                            onChange={() => undefined}
                            disabled={true}
                            ariaLabel={`${value.host_name} 인증 상태(읽기 전용)`}
                          />
                        </td>
                        <td className="list__table-cell">
                          {value.display_order ?? 0}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
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
