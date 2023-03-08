import { useState } from 'react';
import { useQuery } from 'react-query';
import { getReplayEventsApi } from '../../../api/replay';
import List from '../../molecules/List';

const ReplayList = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());

  const { data, refetch } = useQuery(
    ['fetchReplay', { year }],
    async () => await getReplayEventsApi({ year }),
    { refetchOnWindowFocus: false }
  );

  return (
    <List
      data={data}
      refetch={refetch}
      year={year}
      setYear={setYear}
      emptyText="올해의 다시보기가 없어요! 다시보기를 만들어주세요"
      modifyLink="/admin/replay/modify"
      createButtonText="이벤트 다시보기 생성"
    />
  );
};

export default ReplayList;
