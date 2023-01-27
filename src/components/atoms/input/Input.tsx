import { useId } from 'react';
import classNames from 'classnames';
import type { ReactNode, InputHTMLAttributes } from 'react';

type TextProps = {
  text?: string;
  isRequired?: boolean;
};

type InputProps = {
  value: string;
  onChange?: (e: { target: { value: string } }) => void;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  readonly?: boolean;
  disable?: boolean;
  placeholder?: string;
  autoComplete?: 'on' | 'off';
  customClass?: Record<string, boolean>;
  children?: ReactNode;
} & TextProps;

const Text = ({ id, text, isRequired }: TextProps & { id: string }) => {
  if (!text) return null;
  return (
    <label
      htmlFor={id}
      className="form__content__title inline-block text-base font-medium text-gray-600"
    >
      {text}
      {isRequired && <span className="text-red-500">*</span>}
    </label>
  );
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
      <Text id={id} text={text} isRequired={isRequired} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={isRequired}
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
