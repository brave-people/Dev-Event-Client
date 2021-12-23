import urls from "../../../config/urls";

export const registerUserApi = async (req: {
  name: string;
  email: string;
  password: string;
}) => {
  return await fetch(`${urls.auth}/admin/v1/register/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  }).then((res) => res);
};
