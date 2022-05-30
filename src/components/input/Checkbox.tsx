import { useId } from 'react';
import type { ChangeEventHandler } from 'react';

const Checkbox = ({
  value,
  onChange,
  label,
}: {
  value: boolean | string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  label: string;
}) => {
  const id = useId();

  return (
    <>
      <input id={id} type="checkbox" onChange={onChange} checked={!!value} />
      <label htmlFor={id}>{label}</label>
    </>
  );
};

export default Checkbox;
