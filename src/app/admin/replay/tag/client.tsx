'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTagsApi } from '../../../../api/replay/tag';
import ReplayTagList from '../../../../components/organisms/tag/Replay';
import EventComponent from '../../../../components/templates/Event';
import { Tag } from '../../../../model/Tag';
import { ResponseTokenModel } from '../../../../model/User';
import useRedirectRouter from '../../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  const [tags, setTags] = useState<Tag[]>([]);
  const data = async () => await getTagsApi();

  useEffect(() => {
    // https://github.com/vercel/next.js/discussions/20641?sort=new
    // vercel 배포 후 500 에러 이슈로 인해 useEffect 내부에서 호출하도록 수정
    data().then((res) => setTags(res));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="태그 관리">
        <ReplayTagList tags={tags} />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
