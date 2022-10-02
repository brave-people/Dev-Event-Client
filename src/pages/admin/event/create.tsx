import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { stores } from '../../../store';
import getToken from '../../../server/api/auth/getToken';
import { getTagsApi } from '../../api/events/tag';
import EventComponent from '../../../components/Event';
import EventCreateForm from '../../../components/event/Create';
import type { NextPageContext } from 'next/types';

const queryClient = new QueryClient();

const EventCreate = () => {
  const setTags = useSetRecoilState(stores.tags);
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

export const getServerSideProps = async (context: NextPageContext) => {
  const cookie = context.req?.headers.cookie;
  const token = await getToken(cookie);

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

export default EventCreate;
