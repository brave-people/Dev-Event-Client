import type { NextPageContext } from 'next/types';
import getToken from '../../../server/api/auth/getToken';
import { QueryClient, QueryClientProvider } from 'react-query';
import EventComponent from '../../../components/templates/Event';
import BannerCreateForm from '../../../components/organisms/banner/Create';

const queryClient = new QueryClient();

const Banner = () => (
  <QueryClientProvider client={queryClient}>
    <EventComponent title="모바일 메인 최상단 배너 등록">
      <BannerCreateForm />
    </EventComponent>
  </QueryClientProvider>
);

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

export default Banner;
