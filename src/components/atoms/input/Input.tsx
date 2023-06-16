import { useId } from 'react';
import type { ReactNode, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import BaseLabel from '../label/base';

type InputProps = {
  value: string;
  onChange?: (e: { target: { value: string } }) => void;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  readonly?: boolean;
  disable?: boolean;
  placeholder?: string;
  autoComplete?: 'on' | 'off';
  customClass?: Record<string, boolean>;
  text?: string;
  isRequired?: boolean;
  children?: ReactNode;
};

const Input = ({
  text,
  value,
  onChange,
  type = 'text',
  isRequired = false,
  readonly = false,
  disable = false,
  placeholder,
  autoComplete,
  customClass,
  children,
}: InputProps) => {
  const id = useId();

  return (
    <div className="form__content__input">
      <BaseLabel
        htmlFor={id}
        title={text ?? ''}
        required={isRequired ?? false}
      />
      <input
        id={id}
        type={type}
        defaultValue={value}
        required={isRequired}
        onChange={onChange}
        readOnly={readonly}
        disabled={disable}
        autoComplete={autoComplete}
        {...(placeholder && { placeholder })}
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
