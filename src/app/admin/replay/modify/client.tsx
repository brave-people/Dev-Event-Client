'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from 'next/client';
import { useSearchParams } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { getReplayEventApi } from '../../../../api/replay';
import { getTagsApi } from '../../../../api/replay/tag';
import ReplayModifyForm from '../../../../components/organisms/replay/Modify';
import EventComponent from '../../../../components/templates/Event';
import type { EventResponse } from '../../../../model/Event';
import type { ResponseTokenModel } from '../../../../model/User';
import { linksAtom } from '../../../../store/replay';
import { replayTagsAtom } from '../../../../store/tags';
import useRedirectRouter from '../../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const setTags = useSetAtom(replayTagsAtom);
  const setReplayLinks = useSetAtom(linksAtom);
  const [replay, setReplay] = useState<EventResponse>();

  if (!id) {
    alert('수정할 다시보기가 올바르지 않아요');
    router.push('/replay');
  }

  const data = async () =>
    await getReplayEventApi({ id: id?.toString() || '' });
  const tagsData = async () => await getTagsApi();

  useEffect(() => {
    data().then((res) => {
      setReplay(res);
      setReplayLinks(res.links ?? []);
    });
    tagsData().then((res) => setTags(res));
  }, []);

  if (!replay) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발행사 다시보기 수정">
        <ReplayModifyForm replay={replay} />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
