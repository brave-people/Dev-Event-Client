'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSetAtom } from 'jotai';
import { getTagsApi } from '../../../../api/replay/tag';
import ReplayCreateForm from '../../../../components/organisms/replay/Create';
import EventComponent from '../../../../components/templates/Event';
import type { ResponseTokenModel } from '../../../../model/User';
import { replayTagsAtom } from '../../../../store/tags';
import useRedirectRouter from '../../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  const setTags = useSetAtom(replayTagsAtom);
  const tagsData = async () => await getTagsApi();

  useEffect(() => {
    tagsData().then((res) => setTags(res));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발행사 다시보기 등록">
        <ReplayCreateForm />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
