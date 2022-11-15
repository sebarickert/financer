import clsx from 'clsx';

interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
}

export const Checkbox = ({
  id,
  label,
  checked = false,
}: CheckboxProps): JSX.Element => {
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
          name={id}
          type="checkbox"
          className="w-4 h-4 text-blue bg-gray border-gray-dark focus:ring-blue focus:ring-2"
          defaultChecked={checked}
        />
      </div>
      <span className="text-base font-medium text-charcoal">{label}</span>
    </label>
  );
};
