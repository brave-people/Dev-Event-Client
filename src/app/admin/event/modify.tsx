import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import type { NextPageContext } from 'next/types';
import { useSetAtom } from 'jotai';
import { getEventApi } from '../../../api/events';
import { getTagsApi } from '../../../api/events/tag';
import EventModifyForm from '../../../components/organisms/event/Modify';
import EventComponent from '../../../components/templates/Event';
import type { EventResponseModel } from '../../../model/Event';
import getToken from '../../../server/api/auth/getToken';
import { eventTagsAtom } from '../../../store/tags';

const queryClient = new QueryClient();

const EventModify = () => {
  const { query } = useRouter();
  const setTags = useSetAtom(eventTagsAtom);
  const [event, setEvent] = useState<EventResponseModel>();

  const data = async () =>
    await getEventApi({ id: query.id?.toString() || '' });

  const tagsData = async () => await getTagsApi();

  useEffect(() => {
    // https://github.com/vercel/next.js/discussions/20641?sort=new
    // vercel 배포 후 500 에러 이슈로 인해 useEffect 내부에서 호출하도록 수정
    data().then((res) => setEvent(res));
    tagsData().then((res) => setTags(res));
  }, []);

  if (!event) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발자 행사 수정">
        <EventModifyForm event={event} />
      </EventComponent>
    </QueryClientProvider>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);
  const { id = '' } = context.query;

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  // id가 없다면 이벤트 조회 페이지로 이동
  if (!id) return { redirect: { destination: '/admin/event' } };
  return { props: {} };
};

export default EventModify;
