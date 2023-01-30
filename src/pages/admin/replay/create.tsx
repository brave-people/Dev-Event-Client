import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSetAtom } from 'jotai';
import { replayTagsAtom } from '../../../store/tags';
import getToken from '../../../server/api/auth/getToken';
import { getTagsApi } from '../../api/replay/tag';
import EventComponent from '../../../components/templates/Event';
import ReplayCreateForm from '../../../components/organisms/replay/Create';
import type { NextPageContext } from 'next/types';

const queryClient = new QueryClient();

const EventCreate = () => {
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

export default EventCreate;