import { useId, useState } from 'react';
import classNames from 'classnames';

const InputLine = ({
  text,
  value,
  onChange,
  type = 'text',
  isRequired = true,
  labelClassName,
}: {
  text: string;
  type?: string;
  isRequired?: boolean;
  value: string;
  onChange?: (e: { target: { value: string } }) => void;
  labelClassName?: string;
}) => {
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={classNames(
          labelClassName,
          'block text-gray-700 text-sm mb-2'
        )}
      >
        {text}
      </label>
      <input
        id={id}
        type={type}
        required={isRequired}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="input--line"
      />
      {focused && <div className="input--line__border" />}
    </div>
  );
};

export default InputLine;
