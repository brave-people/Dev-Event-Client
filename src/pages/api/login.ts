import urls from '../../config/urls';

export const loginApi = async (req: { user_id: string; password: string }) => {
  const formBody = Object.entries(req)
    .map((v) => v.join('='))
    .join('&');

  return await fetch(`${urls.auth}/admin/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: formBody,
  }).then((res) => res.json());
};
