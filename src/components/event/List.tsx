import { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getEventsApi } from '../../pages/api/events';
import { deleteEventApi } from '../../pages/api/events/delete';
import type { EventResponseModel } from '../../model/Event';
import YearAndMonthPicker from './date/YearAndMonthPicker';
import getConvertNumberAddTen from '../../util/get-convert-number-add-ten';
import CenterAlert from '../alert/CenterAlert';
import { useRouter } from 'next/router';

const List = () => {
  const router = useRouter();

  const [currentDate] = useState<Date>(new Date());
  const [list, setList] = useState<EventResponseModel[]>([]);
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [showAlert, setShowAlert] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const { status, isError, data, refetch } = useQuery(
    ['fetchEvents', { year, month }],
    async () => await getEventsApi({ year, month: month + 1 }),
    { refetchOnWindowFocus: false }
  );

  const deleteEvent = async () => {
    const data = currentId && (await deleteEventApi({ id: currentId }));
    console.log(data?.message);
    setShowAlert(false);
    await refetch();
  };

  useEffect(() => {
    if (!data) return setList([]);
    if (!keyword) return setList(data);

    const findKeywordList = data.filter((eventList) =>
      eventList.title.includes(keyword)
    );
    return setList(findKeywordList);
  }, [keyword, data]);

  return (
    <div>
      <article className="list__header">
        {currentDate && (
          <button>
            <span>{currentDate.getFullYear()}.</span>
            <span>{getConvertNumberAddTen(currentDate.getMonth() + 1)}</span>
          </button>
        )}
        <input
          type="text"
          placeholder="모임명으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </article>
      <YearAndMonthPicker year={year} setYear={setYear} setMonth={setMonth} />
      {!list.length ? (
        <div>
          <p>이달의 이벤트가 없어요! 이벤트를 만들어주세요</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <td>No</td>
              <td>제목</td>
              <td>링크</td>
              <td>등록일시</td>
              <td>수정일시</td>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 &&
              list.map((value: EventResponseModel, index: number) => (
                <Fragment key={value.id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{value.title}</td>
                    <td>
                      <a href={value.event_link}>홈페이지</a>
                    </td>
                    <td>
                      {value.tags.slice(0, 2).map((tag) => (
                        <span key={tag.id}>{tag.tag_name}</span>
                      ))}
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
                            className="text-red-500 font-bold"
                            onClick={() =>
                              router.push(`/admin/event/modify?id=${value.id}`)
                            }
                          >
                            수정
                          </button>
                          <button
                            className="text-blue-500 font-bold"
                            onClick={() => {
                              setCurrentId(value.id);
                              setShowAlert(true);
                            }}
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
      {showAlert && (
        <CenterAlert
          title="정말 삭제할까요?"
          description="돌이킬 수 없어요!"
          showAlert={setShowAlert}
          save={deleteEvent}
        />
      )}
    </div>
  );
};

export default List;
