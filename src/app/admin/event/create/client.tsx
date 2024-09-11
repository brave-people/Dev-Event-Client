'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { getTagsApi } from '../../../../api/events/tag';
import EventCreateForm from '../../../../components/organisms/event/Create';
import EventComponent from '../../../../components/templates/Event';
import type { ResponseTokenModel } from '../../../../model/User';
import { eventTagsAtom } from '../../../../store/tags';
import useRedirectRouter from '../../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  const setTags = useSetAtom(eventTagsAtom);
  const tagsData = async () => await getTagsApi();

  useEffect(() => {
    tagsData().then((res) => setTags(res));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발자 행사 등록">
        <EventCreateForm />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
