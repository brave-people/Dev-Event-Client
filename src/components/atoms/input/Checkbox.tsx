import { useId } from 'react';
import type { ChangeEventHandler } from 'react';

const Checkbox = ({
  label,
  checked,
  onChange,
  value,
}: {
  label: string;
  checked: boolean | string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string;
}) => {
  const id = useId();

  return (
    <>
      <input
        id={id}
        type="checkbox"
        onChange={onChange}
        checked={!!checked}
        {...(value && { value })}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor={id} className="ml-2 text-gray-800 text-sm">
        {label}
      </label>
    </>
  );
};

export default Checkbox;
