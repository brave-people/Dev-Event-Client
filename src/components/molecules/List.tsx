import { Fragment, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import type { EventResponse } from '../../model/Event';
import { layerAtom } from '../../store/layer';
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

  const [currentId, setCurrentId] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [keyword, setKeyword] = useState('');
  const [maxHeight, setMaxHeight] = useState<string | null>(null);

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
      <div className="list__table relative mt-8 border rounded">
        {!filteredData.length ? (
          <p className="py-24 text-center font-bold text-base">{emptyText}</p>
        ) : (
          <table className="w-full p-4">
            <thead className="list__table--thead">
              <tr>
                <td className="list__table--title">No</td>
                <td className="list__table--title">제목</td>
                <td className="list__table--title">링크</td>
                <td className="list__table--title">시작 일시</td>
                <td className="list__table--title">종료 일시</td>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 &&
                filteredData.map((value, index) => (
                  <Fragment key={value.id}>
                    <tr>
                      <td className="list__table--sub-title">{index + 1}</td>
                      <td>{value.title}</td>
                      <td>
                        <a
                          href={value.event_link}
                          className="list__table__tag list__table--link"
                        >
                          홈페이지
                        </a>
                      </td>
                      <td>{value.start_date_time}</td>
                      <td>{value.end_date_time}</td>
                      <td>
                        <div className="list--group">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                          <div className="list--group__button">
                            <button
                              className="text-blue-500 font-bold"
                              onClick={() =>
                                router.push(
                                  `${parentLink}/modify?id=${value.id}`
                                )
                              }
                            >
                              수정
                            </button>
                            <button
                              className="text-red-500 font-bold"
                              onClick={() => clickDeleteButton(value.id)}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))}
            </tbody>
          </table>
        )}
        {maxHeight && (
          <button
            type="button"
            className="list__button--pop"
            onClick={() => router.push(`${parentLink}/create`)}
            style={{ top: maxHeight }}
          >
            {createButtonText}
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
