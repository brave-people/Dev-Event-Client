import type { TokenModel } from '../model/User';

const UpdateTokenInCookie = (document: Document, data: TokenModel) => {
  return (
    data &&
    Object.entries(data).forEach(
      (token) => (document.cookie = `${token[0]}=${token[1]}; path=/;`)
    )
  );
};

export default UpdateTokenInCookie;
