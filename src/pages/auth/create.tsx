import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextPageContext } from 'next/types';
import type { ResponseTokenModel } from '../../model/User';
import { baseRouter } from '../../config/constants';
import getToken from '../../server/api/auth/getToken';
import { useUpdateCookie } from '../../util/use-cookie';
import { getUserRoleIsAdmin } from '../../util/get-user-role';
import User from '../../components/User';
import Component from '../../components/auth/form/User';

const Create = ({ data, error }: ResponseTokenModel) => {
  const router = useRouter();

  useEffect(() => {
    if (error) {
      alert(error);
      router.push(baseRouter() + '/auth/signIn');
    }
    if (data?.access_token) useUpdateCookie(document, data);
  }, []);

  return (
    <User title="계정 생성">
      <Component />
    </User>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);

  if (cookies && (!token || token?.error)) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  const accessToken = jwt.decode(token?.data?.access_token) as JwtPayload;
  if (!token && !getUserRoleIsAdmin(accessToken?.roles)) {
    return {
      props: {
        error: '관리자만 계정을 생성할 수 있어요!',
      },
    };
  }

  return { props: token };
};

export default Create;
