import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import type { NextPageContext } from 'next/types';
import BannerModifyForm from '../../../components/organisms/banner/Modify';
import EventComponent from '../../../components/templates/Event';
import type { BannerResponse } from '../../../model/Banner';
import getToken from '../../../server/api/auth/getToken';
import { getBannerApi } from '../../api/banner';

const queryClient = new QueryClient();

const Banner = () => {
  const { query } = useRouter();
  const [banners, setBanners] = useState<BannerResponse>();

  const data = async () =>
    await getBannerApi({ id: query.id?.toString() || '' });

  useEffect(() => {
    // https://github.com/vercel/next.js/discussions/20641?sort=new
    // vercel 배포 후 500 에러 이슈로 인해 useEffect 내부에서 호출하도록 수정
    data().then((res) => setBanners(res));
  }, []);

  if (!banners) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="모바일 메인 최상단 배너 수정">
        <BannerModifyForm banner={banners} />
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

export default Banner;
