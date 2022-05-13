import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'react-datepicker/dist/react-datepicker.css';
import getToken from '../../../server/api/auth/getToken';
import getTags from '../../../server/api/events/getTags';
import { useUpdateCookie } from '../../../util/use-cookie';
import EventComponent from '../../../components/Event';
import EventCreateForm from '../../../components/event/CreateForm';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import type { TagModel } from '../../../model/Tag';

const queryClient = new QueryClient();

const EventCreate = (data: { token: TokenModel; allTags: TagModel[] }) => {
  const { token, allTags } = data || {};

  useEffect(() => {
    if (token?.access_token) useUpdateCookie(document, token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발자 행사 등록">
        <EventCreateForm allTags={allTags} />
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

  const tags = await getTags(token.data['access_token']);
  return { props: { token: token.data, allTags: tags } };
};

export default EventCreate;
