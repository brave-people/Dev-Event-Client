import { ReactNode } from 'react';
import classNames from 'classnames';

const Input = ({
  text,
  value,
  onChange,
  isRequired = false,
  customClass,
  children,
}: {
  text: string;
  value: string;
  onChange: () => void;
  isRequired?: boolean;
  customClass?: Record<string, boolean>;
  children?: ReactNode;
}) => {
  return (
    <div className="form__content__input">
      <label
        htmlFor="title"
        className="form__content__title inline-block text-base font-medium text-gray-600"
      >
        {text}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        id="title"
        type="text"
        value={value}
        onChange={onChange}
        required
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
