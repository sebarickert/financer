import clsx from 'clsx';
import type { JSX } from 'react';
import { useFormContext } from 'react-hook-form';

type CheckboxProps = {
  id: string;
  label: string;
  name: string;
  value: string;
};

export const Checkbox = ({
  id,
  label,
  name,
  value,
}: CheckboxProps): JSX.Element => {
  const { register } = useFormContext();

  return (
    <label
      className={clsx(
        'flex items-center p-4 gap-4 rounded-md hover:bg-accent hover:cursor-pointer text-foreground',
      )}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        value={value}
        className={clsx(
          'w-6 h-6 peer rounded-sm',
          'bg-layer hover:bg-accent border text-blue',
        )}
        {...register(name)}
      />
      <span>{label}</span>
    </label>
  );
};
