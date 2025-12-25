import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from 'react-query';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import type { EventResponse } from '../../model/Event';
import { layerAtom } from '../../store/layer';
import { formatDate } from '../../util/date-format';
import ContentHeader from '../organisms/form/replay/ContentHeader';
import Alert from './Alert';

type ListProps<T> = {
  data?: T[];
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<T[], unknown>>;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  deleteApi: ({ id }: { id: number }) => void;
  month?: number;
  setMonth?: Dispatch<SetStateAction<number>>;
  emptyText: string;
  parentLink: string;
  createButtonText: string;
};

const List = <T extends EventResponse>({
  data,
  refetch,
  year,
  setYear,
  month,
  setMonth,
  emptyText,
  parentLink,
  createButtonText,
  deleteApi,
}: ListProps<T>) => {
  const router = useRouter();
  const [layer, setLayer] = useAtom(layerAtom);

  const divRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const [currentId, setCurrentId] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [keyword, setKeyword] = useState('');
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

  const clickDeleteButton = (id: number) => {
    setCurrentId(id);
    setLayer(true);
  };

  const deleteEvent = async () => {
    if (!currentId) return;
    await deleteApi({ id: currentId });
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
  }, [filteredData]);

  useEffect(() => {
    if (!data) return setFilteredData([]);
    if (!keyword) return setFilteredData(data);

    const findKeywordList = data.filter((v) => v.title.includes(keyword));
    return setFilteredData(findKeywordList);
  }, [keyword, data]);

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
      <ContentHeader
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        keyword={keyword}
        setKeyword={setKeyword}
      />

      <div className="list__container">
        {!filteredData.length ? (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="list__empty-text">{emptyText}</p>
          </div>
        ) : (
          <div className="list__table-wrapper">
            <table className="list__table">
              <thead>
                <tr>
                  <th className="list__table-header">No</th>
                  <th className="list__table-header list__table-header--title">
                    제목
                  </th>
                  <th className="list__table-header">시작 일시</th>
                  <th className="list__table-header">종료 일시</th>
                  <th className="list__table-header list__table-header--actions">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((value, index) => (
                  <tr key={value.id} className="list__table-row">
                    <td className="list__table-cell list__table-cell--number">
                      {index + 1}
                    </td>
                    <td className="list__table-cell list__table-cell--title">
                      <span className="list__table-title-text">
                        {value.title}
                      </span>
                    </td>
                    <td className="list__table-cell list__table-cell--date">
                      {formatDate(value.start_date_time, 'datetime')}
                    </td>
                    <td className="list__table-cell list__table-cell--date">
                      {formatDate(value.end_date_time, 'datetime')}
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
                                    `${parentLink}/modify?id=${value.id}`
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {maxHeight && (
          <button
            type="button"
            className="list__create-button"
            onClick={() => router.push(`${parentLink}/create`)}
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
            <span>{createButtonText}</span>
          </button>
        )}
      </div>

      {layer && (
        <Alert
          alertTitle="정말 삭제할까요?"
          alertDescription="돌이킬 수 없어요 🥲"
          toggleAlert={setLayer}
          onSave={deleteEvent}
        />
      )}
    </div>
  );
};

export default List;
