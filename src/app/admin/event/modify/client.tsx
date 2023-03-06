'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSearchParams } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { getEventApi } from '../../../../api/events';
import { getTagsApi } from '../../../../api/events/tag';
import EventModifyForm from '../../../../components/organisms/event/Modify';
import EventComponent from '../../../../components/templates/Event';
import { EventResponseModel } from '../../../../model/Event';
import { ResponseTokenModel } from '../../../../model/User';
import { eventTagsAtom } from '../../../../store/tags';
import useRedirectRouter from '../../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const setTags = useSetAtom(eventTagsAtom);
  const [event, setEvent] = useState<EventResponseModel>();

  const data = async () => await getEventApi({ id: id.toString() });

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

export default Client;
