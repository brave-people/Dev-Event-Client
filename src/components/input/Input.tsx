import { useId } from 'react';
import type { ReactNode, InputHTMLAttributes } from 'react';
import classNames from 'classnames';

const Input = ({
  text,
  value,
  onChange,
  type = 'text',
  isRequired = false,
  readonly,
  customClass,
  children,
}: {
  text: string;
  value: string;
  onChange: () => void;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  isRequired?: boolean;
  readonly?: boolean;
  customClass?: Record<string, boolean>;
  children?: ReactNode;
}) => {
  const id = useId();

  return (
    <div className="form__content__input">
      <label
        htmlFor={id}
        className="form__content__title inline-block text-base font-medium text-gray-600"
      >
        {text}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        {...(readonly && readonly)}
        className={classNames(
          'appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
          { ...customClass }
        )}
      />
      {children}
    </div>
  );
};

export default Input;
