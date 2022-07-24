import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import getToken from '../../../server/api/auth/getToken';
import { useUpdateCookie } from '../../../util/use-cookie';
import EventComponent from '../../../components/Event';
import EventTagList from '../../../components/event/tag/List';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import { getTagsApi } from '../../api/events/tag';
import { Tag } from '../../../model/Tag';

const queryClient = new QueryClient();

const EventTag = ({ token }: { token: TokenModel }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  const data = async () => await getTagsApi();

  useEffect(() => {
    if (token) {
      useUpdateCookie(document, token);

      // https://github.com/vercel/next.js/discussions/20641?sort=new
      // vercel 배포 후 500 에러 이슈로 인해 useEffect 내부에서 호출하도록 수정
      data().then((res) => setTags(res));
    }
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

  return { props: { token: token.data } };
};

export default EventTag;
