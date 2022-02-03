import { useRouter } from 'next/router';
import EventComponent from '../../../components/Event';
import { baseRouter } from '../../../config/constants';

const EventCreate = () => {
  const router = useRouter();

  return (
    <EventComponent>
      <div>
        <h2>이벤트 생성</h2>
        <button onClick={() => router.push(baseRouter() + '/admin/event')}>
          확인
        </button>
      </div>
    </EventComponent>
  );
};

export default EventCreate;
