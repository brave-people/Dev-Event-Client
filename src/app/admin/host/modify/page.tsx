import updateToken from '../../../../util/update-token';
import ClientComponent from './client';

const Page = async () => {
  const token = await updateToken();
  return <ClientComponent token={token} />;
};

export default Page;
