'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSearchParams } from 'next/navigation';
import { getBannerApi } from '../../../../api/banner';
import BannerModifyForm from '../../../../components/organisms/banner/Modify';
import EventComponent from '../../../../components/templates/Event';
import type { BannerResponse } from '../../../../model/Banner';
import type { ResponseTokenModel } from '../../../../model/User';
import useRedirectRouter from '../../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [banners, setBanners] = useState<BannerResponse>();

  const data = async () => await getBannerApi({ id: id.toString() || '' });

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

export default Client;
