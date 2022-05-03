import User from '../User';
import FormPassword from './form/Password';

const Password = () => {
  return (
    <User title="비밀번호 변경">
      <FormPassword />
    </User>
  );
};

export default Password;
