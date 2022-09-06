import cookie from 'cookie';
import { Headers } from '../../../../config/headers';
import type { RequestHeaders } from '../../../../model/Api';
import type { UserProfileModel } from '../../../../model/User';

/** 관리자 회원 프로필 조회 */
export const getUsersProfileApi = async (): Promise<UserProfileModel> => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
  }).then((res) => res.json());
};
