import { useState } from 'react';
import { useQuery } from 'react-query';
import { getEventsApi } from '../../../api/events';
import { deleteEventApi } from '../../../api/events/delete';
import List from '../../molecules/List';

const EventList = () => {
  const [currentDate] = useState<Date>(new Date());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());

  const { data, refetch } = useQuery(
    ['fetchEvents', { year, month }],
    async () => await getEventsApi({ year, month: month + 1 }),
    { refetchOnWindowFocus: false }
  );

  return (
    <List
      data={data}
      refetch={refetch}
      year={year}
      setYear={setYear}
      month={month}
      setMonth={setMonth}
      deleteApi={deleteEventApi}
      emptyText="이달의 이벤트가 없어요! 이벤트를 만들어주세요"
      parentLink="/admin/event"
      createButtonText="이벤트 생성"
    />
  );
};

export default EventList;
