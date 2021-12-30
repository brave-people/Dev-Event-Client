import urls from "../../config/urls";

export const loginApi = async (req: {
  username: string;
  password: string;
}) => {
  return await fetch(`${urls.auth}/admin/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  }).then((res) => res.json());
};
