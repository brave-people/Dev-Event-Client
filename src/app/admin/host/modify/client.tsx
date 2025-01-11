'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSearchParams } from 'next/navigation';
import { getHostApi } from '../../../../api/host';
import HostModifyForm from '../../../../components/organisms/host/Modify';
import EventComponent from '../../../../components/templates/Event';
import { HostResponse } from '../../../../model/Host';
import type { ResponseTokenModel } from '../../../../model/User';
import useRedirectRouter from '../../../../util/hooks/use-redirect-router';

const queryClient = new QueryClient();

const Client = ({ token }: { token: ResponseTokenModel }) => {
  useRedirectRouter(token);

  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [hosts, setHosts] = useState<HostResponse>();

  const data = async () => await getHostApi({ id: id.toString() || '' });

  useEffect(() => {
    // https://github.com/vercel/next.js/discussions/20641?sort=new
    // vercel 배포 후 500 에러 이슈로 인해 useEffect 내부에서 호출하도록 수정
    data().then((res) => setHosts(res));
  }, []);

  if (!hosts) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="최상단 메인 최상단 배너 수정">
        <HostModifyForm host={hosts} />
      </EventComponent>
    </QueryClientProvider>
  );
};

export default Client;
