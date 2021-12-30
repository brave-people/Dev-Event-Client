import urls from '../../../config/urls';

/** 중복 이메일 체크 */
export const registerEmailApi = async (req: { email: string }) => {
  return await fetch(`${urls.auth}/admin/v1/register/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
