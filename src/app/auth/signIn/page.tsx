import { cookies } from 'next/headers';
import ClientComponent from './client';

const Page = () => {
  const saveIdCookie = cookies().get('save_id');
  const value = saveIdCookie?.value ?? '';

  return <ClientComponent data={value} />;
};

export default Page;
