import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getEventsApi } from '../../pages/api/events';
import type { TagModel } from '../../model/Tag';
import type { EventResponseModel } from '../../model/Event';
import YearAndMonthPicker from './Date/YearAndMonthPicker';

const List = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [list, setList] = useState<EventResponseModel[]>([]);
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState(currentDate.getFullYear());
  const month = currentDate.getMonth();

  const { status, isError, data, refetch } = useQuery(
    ['fetchEvents', { year, month }],
    async () => await getEventsApi({ year, month: month + 1 }),
    { refetchOnWindowFocus: false }
  );
  console.log('result: ', status, isError, data);

  const convertNumberAddTen = (number: number) => {
    return number < 10 ? '0' + number : number;
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
      <article className="event-list__header">
        {currentDate && (
          <button>
            <span>{currentDate.getFullYear()}.</span>
            <span>{convertNumberAddTen(currentDate.getMonth() + 1)}</span>
          </button>
        )}
        <input
          type="text"
          placeholder="모임명으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </article>
      <YearAndMonthPicker year={year} setYear={setYear} />
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
          {list?.map((value: EventResponseModel, index: number) => (
            <tr key={value.id}>
              <td>{index + 1}</td>
              <td>{value.title}</td>
              <td>
                <a href={value.event_link}>홈페이지</a>
              </td>
              <td>
                {value.tags.slice(0, 2).map((tag: TagModel) => (
                  <span key={tag.id}>{tag.tag_name}</span>
                ))}
              </td>
              <td>{value.start_date_time}</td>
              <td>{value.end_date_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
