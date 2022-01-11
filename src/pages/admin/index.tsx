import getToken from '../../server/api/auth/getToken';
import type { GetServerSidePropsContext } from 'next/types';

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
};

function Admin() {
  return <div>admin home</div>;
}

export default Admin;
