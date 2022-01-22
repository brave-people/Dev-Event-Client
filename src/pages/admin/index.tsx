import type { GetServerSidePropsContext } from 'next/types';
import getToken from '../../server/api/auth/getToken';

function Admin() {
  return <div>admin home</div>;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = context.req.headers.cookie;
  const token = await getToken(cookies);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  return { props: {} };
};

export default Admin;
