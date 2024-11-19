import clsx from 'clsx';
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
        'flex items-center p-4 gap-4 rounded-md theme-bg-color-with-hover hover:cursor-pointer text-[--color-text-primary]',
      )}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        value={value}
        className={clsx(
          'w-6 h-6 peer rounded-sm',
          'theme-layer-color-with-hover border theme-border-primary text-blue-600',
        )}
        {...register(name)}
      />
      <span>{label}</span>
    </label>
  );
};
