import type { UserAuthType } from '../model/User';

export const getConvertAuthType = (type: UserAuthType) => {
  if (type === 'ADMIN') return '관리자';
  if (type === 'KAKAO') return '카카오';
  if (type === 'NAVER') return '네이버';
  if (type === 'GOOGLE') return '구글';
  if (type === 'GITHUB') return 'Github';

  return '';
};
