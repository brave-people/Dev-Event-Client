import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import getToken from '../../../server/api/auth/getToken';
import EventComponent from '../../../components/templates/Event';
import EventTagList from '../../../components/organisms/tag/Event';
import { getTagsApi } from '../../../api/events/tag';
import type { NextPageContext } from 'next/types';
import type { Tag } from '../../../model/Tag';

const queryClient = new QueryClient();

const EventTag = () => {
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
