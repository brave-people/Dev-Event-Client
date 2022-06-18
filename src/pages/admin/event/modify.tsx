import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import getToken from '../../../server/api/auth/getToken';
import { getEventApi } from '../../api/events';
import { useUpdateCookie } from '../../../util/use-cookie';
import EventComponent from '../../../components/Event';
import EventModifyForm from '../../../components/event/Modify';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import type { EventResponseModel } from '../../../model/Event';

const queryClient = new QueryClient();

const EventModify = ({
  token,
  event,
}: {
  token: TokenModel;
  event: EventResponseModel;
}) => {
  useEffect(() => {
    if (token) useUpdateCookie(document, token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발자 행사 수정">
        <EventModifyForm event={event} />
      </EventComponent>
    </QueryClientProvider>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);
  const { id = '' } = context.query;

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  // id가 없다면 이벤트 조회 페이지로 이동
  if (!id) return { redirect: { destination: '/admin/event' } };

  const data = await getEventApi({ token: token.data, id: id.toString() });
  return { props: { token: token.data, event: data } };
};

export default EventModify;
