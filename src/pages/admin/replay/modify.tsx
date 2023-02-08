import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import type { NextPageContext } from 'next/types';
import { useSetAtom } from 'jotai';
import ReplayModifyForm from '../../../components/organisms/replay/Modify';
import EventComponent from '../../../components/templates/Event';
import type { ReplayResponseModel } from '../../../model/Replay';
import getToken from '../../../server/api/auth/getToken';
import { linksAtom } from '../../../store/replay';
import { replayTagsAtom } from '../../../store/tags';
import { getReplayEventApi } from '../../api/replay';
import { getTagsApi } from '../../api/replay/tag';

const queryClient = new QueryClient();

const ReplayModify = () => {
  const {
    query: { id = '' },
  } = useRouter();

  const setTags = useSetAtom(replayTagsAtom);
  const setReplayLinks = useSetAtom(linksAtom);
  const [replay, setReplay] = useState<ReplayResponseModel>();

  const data = async () => await getReplayEventApi({ id: id.toString() });
  const tagsData = async () => await getTagsApi();

  useEffect(() => {
    data().then((res) => {
      setReplay(res);
      setReplayLinks(res.links);
    });
    tagsData().then((res) => setTags(res));
  }, []);

  if (!replay) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent title="개발행사 다시보기 수정">
        <ReplayModifyForm replay={replay} />
      </EventComponent>
    </QueryClientProvider>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const { id } = context.query;
  const token = await getToken(cookies);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  // id가 없다면 이벤트 조회 페이지로 이동
  if (!id) return { redirect: { destination: '/admin/replay' } };

  return { props: { token: token.data } };
};

export default ReplayModify;
