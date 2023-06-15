import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

const Page = async () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');

  redirect('/auth/signIn');
};

export default Page;
