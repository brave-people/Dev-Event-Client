import Head from 'next/head';
import getToken from '../server/api/auth/getToken';
import type { NextPageContext } from 'next/types';

const Home = () => {
  return (
    <Head>
      <title>Dev Event Client</title>
    </Head>
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

  return {
    redirect: {
      destination: '/admin/event',
    },
  };
};

export default Home;
