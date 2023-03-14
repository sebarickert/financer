import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

interface CheckboxProps {
  id: string;
  label: string;
  name: string;
  value: string;
}

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
        'flex items-center p-4 gap-4 rounded-md hover:bg-gray-dark focus-within:bg-gray-dark  hover:cursor-pointer'
      )}
      htmlFor={id}
    >
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          value={value}
          className="w-4 h-4 text-blue bg-gray border-gray-dark focus:ring-blue focus:ring-2"
          {...register(name)}
        />
      </div>
      <span className="text-base font-medium text-charcoal">{label}</span>
    </label>
  );
};
