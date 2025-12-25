import dayjs from 'dayjs';
import { useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { getBannersApi } from '../../../api/banner';
import { deleteBannersApi } from '../../../api/banner/delete';
import type { BannerResponse } from '../../../model/Banner';
import { layerAtom } from '../../../store/layer';
import Alert from '../../molecules/Alert';

const List = () => {
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
        const dropdownWidth = 120; // 드롭다운 최소 너비
        const rightMargin = 16; // 우측 여백

        // 버튼 오른쪽 끝 기준으로 드롭다운 배치
        let left = rect.right - dropdownWidth;

        // 화면 오른쪽을 넘어가는지 체크
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
    ['fetchBanners'],
    async () => await getBannersApi(),
    { refetchOnWindowFocus: false }
  );

  const convertBannerStatus = (
    isVisible: 'Y' | 'N',
    startDateTime: string,
    endDateTime: string
  ) => {
    if (isVisible === 'N') return '미노출';

    const today = dayjs();
    if (today < dayjs(startDateTime)) return '노출 대기';
    if (today > dayjs(startDateTime) && today < dayjs(endDateTime))
      return '노출';
    if (today > dayjs(endDateTime)) return '노출 종료';
  };

  const clickDeleteButton = (id: number) => {
    setCurrentId(id);
    setLayer(true);
  };

  const deleteBanner = async () => {
    if (!currentId) return;
    await deleteBannersApi({ id: currentId });
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
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <p className="list__empty-text">
              아직 배너가 없어요! 배너를 만들어주세요
            </p>
          </div>
        ) : (
          <div className="list__table-wrapper">
            <table className="list__table">
              <thead>
                <tr>
                  <th className="list__table-header" style={{ width: '80px' }}>
                    No
                  </th>
                  <th className="list__table-header list__table-header--title">
                    배너 제목
                  </th>
                  <th
                    className="list__table-header"
                    style={{ minWidth: '140px' }}
                  >
                    상태
                  </th>
                  <th className="list__table-header" style={{ width: '100px' }}>
                    우선순위
                  </th>
                  <th className="list__table-header" style={{ width: '180px' }}>
                    노출 시작일
                  </th>
                  <th className="list__table-header" style={{ width: '180px' }}>
                    노출 종료일
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
                {data.map((value: BannerResponse, index) => {
                  const convertEndDateText = value.end_date_time?.includes(
                    '9999-'
                  )
                    ? '상시 노출'
                    : value.end_date_time;

                  return (
                    <tr key={value.id} className="list__table-row">
                      <td className="list__table-cell list__table-cell--number">
                        {index + 1}
                      </td>
                      <td className="list__table-cell list__table-cell--title">
                        <span className="list__table-title-text">
                          {value.title}
                        </span>
                      </td>
                      <td className="list__table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {convertBannerStatus(
                            value.visible_yn,
                            value.start_date_time,
                            value.end_date_time
                          )}
                        </span>
                      </td>
                      <td className="list__table-cell">{value.priority}</td>
                      <td className="list__table-cell list__table-cell--date">
                        {value.start_date_time}
                      </td>
                      <td className="list__table-cell list__table-cell--date">
                        {convertEndDateText}
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
                                      `/admin/banner/modify?id=${value.id}`
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
            onClick={() => router.push('/admin/banner/create')}
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
            <span>배너 생성</span>
          </button>
        )}
      </div>

      {layer && (
        <Alert
          alertTitle="정말 삭제할까요?"
          alertDescription="돌이킬 수 없어요 🥲"
          toggleAlert={setLayer}
          onSave={deleteBanner}
        />
      )}
    </div>
  );
};

export default List;
