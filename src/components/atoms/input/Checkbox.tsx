import { useId } from 'react';
import type { ChangeEventHandler } from 'react';

const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean | string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  const id = useId();

  return (
    <>
      <input id={id} type="checkbox" onChange={onChange} checked={!!checked} />
      <label htmlFor={id}>{label}</label>
    </>
  );
};

export default Checkbox;
