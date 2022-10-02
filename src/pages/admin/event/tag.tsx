import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import getToken from '../../../server/api/auth/getToken';
import EventComponent from '../../../components/Event';
import EventTagList from '../../../components/event/tag/List';
import { getTagsApi } from '../../api/events/tag';
import type { NextPageContext } from 'next/types';
import type { Tag } from '../../../model/Tag';

const queryClient = new QueryClient();

const EventTag = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  const data = async () => await getTagsApi();

  useEffect(() => {
    data().then((res) => setTags(res));
  }, []);

  if (!tags.length) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="태그 관리">
        <EventTagList tags={tags} />
      </EventComponent>
    </QueryClientProvider>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  return { props: {} };
};

export default EventTag;
