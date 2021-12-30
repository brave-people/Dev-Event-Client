import urls from "../../../config/urls";

/** 중복 아이디 체크 */
export const registerIdApi = async (req: { user_id: string }) => {
  return await fetch(`${urls.auth}/admin/v1/register/id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
