import { useAtom } from 'jotai';
import { userAtom } from '../../../store/user';
import { getUserRole } from '../../../util/get-user-role';
import Input from '../../input/Input';
import ErrorContext from '../../ErrorContext';
import type { UserContent } from '../../../model/User';

const FormContent = ({
  user_id,
  name,
  email,
  password,
  changeUserId,
  changeName,
  changeEmail,
  changePassword,
  errorEmailMessage,
  roles = [],
  buttonLabel,
  submit,
  readonlyList,
  children,
}: UserContent) => {
  const [user] = useAtom(userAtom);
  const convertRoles = getUserRole(roles);

  if (!user) return null;

  const readonlyInput = (value: string) =>
    !!readonlyList?.find((item) => item === value);

  return (
    <div className="form--large">
      <div className="form__content">
        <Input
          text="아이디"
          value={user_id}
          onChange={changeUserId}
          isRequired={readonlyInput('user_id')}
          readonly={readonlyInput('user_id')}
          disable={readonlyInput('user_id')}
        />
        <Input
          text="이름"
          value={name}
          onChange={changeName}
          isRequired={true}
          readonly={readonlyInput('name')}
        />
        <Input
          text="이메일"
          value={email}
          type="email"
          onChange={changeEmail}
          isRequired={true}
          readonly={readonlyInput('email')}
        >
          {errorEmailMessage && <ErrorContext title={errorEmailMessage} />}
        </Input>
        {changePassword && (
          <Input
            text="패스워드"
            value={password || ''}
            type="password"
            onChange={changePassword}
            isRequired={true}
          />
        )}
        {convertRoles.length > 0 && (
          <>
            <span className="form__content__title inline-block text-base font-medium text-gray-600">
              권한
            </span>
            {convertRoles.map((role, index) => (
              <button key={index}>{role}</button>
            ))}
          </>
        )}
      </div>
      {children}
      <button
        className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        onClick={submit}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default FormContent;
