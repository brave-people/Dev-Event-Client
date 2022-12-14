import { Fragment, useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { layerAtom } from '../../../store/layer';
import { getEventsApi } from '../../../pages/api/events';
import { deleteEventApi } from '../../../pages/api/events/delete';
import FormList from '../form/event/List';
import CenterAlert from '../../molecules/alert/CenterAlert';
import type { EventResponseModel } from '../../../model/Event';

const List = () => {
  const router = useRouter();
  const [layer, setLayer] = useAtom(layerAtom);

  const divRef = useRef<HTMLDivElement>(null);

  const [currentDate] = useState<Date>(new Date());
  const [list, setList] = useState<EventResponseModel[]>([]);
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [maxHeight, setMaxHeight] = useState<string | null>(null);

  const { data, refetch } = useQuery(
    ['fetchEvents', { year, month }],
    async () => await getEventsApi({ year, month: month + 1 }),
    { refetchOnWindowFocus: false }
  );

  const clickDeleteButton = (id: number) => {
    setCurrentId(id);
    setLayer(true);
  };

  const deleteEvent = async () => {
    if (!currentId) return;
    await deleteEventApi({ id: currentId });
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
  }, [list]);

  useEffect(() => {
    if (!data) return setList([]);
    if (!keyword) return setList(data);

    const findKeywordList = data.filter((eventList) =>
      eventList.title.includes(keyword)
    );
    return setList(findKeywordList);
  }, [keyword, data]);

  return (
    <div ref={divRef} className="list">
      <FormList
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <div className="list__table relative mt-8 border rounded">
        {!list.length ? (
          <p className="py-24 text-center font-bold text-base">
            이달의 이벤트가 없어요! 이벤트를 만들어주세요
          </p>
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
              {list.length > 0 &&
                list.map((value: EventResponseModel, index: number) => (
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
                                  `/admin/event/modify?id=${value.id}`
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
            onClick={() => router.push('/admin/event/create')}
            style={{ top: maxHeight }}
          >
            이벤트 생성
          </button>
        )}
      </div>
      {layer && (
        <CenterAlert
          title="정말 삭제할까요?"
          description="돌이킬 수 없어요 🥲"
          showAlert={setLayer}
          save={deleteEvent}
        />
      )}
    </div>
  );
};

export default List;
