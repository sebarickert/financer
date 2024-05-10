import { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';

interface SelectProps {
  children: React.ReactNode;
  help?: string;
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  options: Option[];
  defaultValue?: string;
  className?: string;
  handleOnChange?(event: React.ChangeEvent<HTMLSelectElement>): void;
  testId?: string;
  placeholder?: string;
  shouldUnregister?: boolean;
}

export interface Option {
  value: string;
  label: string;
}

export const Select = ({
  children,
  help = '',
  id,
  isRequired = false,
  options,
  className = '',
  testId,
  isDisabled = false,
  placeholder = 'Select option',
  handleOnChange = () => {},
  shouldUnregister,
}: SelectProps): JSX.Element => {
  const { register } = useFormContext();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!handleOnChange) return null;

    handleOnChange(event);
  };

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-medium tracking-tight uppercase text-black/75"
      >
        {children}
        <select
          data-testid={testId}
          id={id}
          className="block w-full py-3 pl-3 pr-10 mt-1 text-base font-normal tracking-normal border border-transparent rounded-md bg-gray text-charcoal focus:outline-none focus:ring-black focus:border-black hover:cursor-pointer"
          required={isRequired}
          aria-describedby={help && `${id}-description`}
          disabled={isDisabled}
          {...register(id, {
            disabled: isDisabled,
            onChange: handleChange,
            required: isRequired,
            shouldUnregister,
          })}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(({ value, label }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {help && (
        <p className="mt-2 text-sm text-charcoal" id={`${id}-description`}>
          {help}
        </p>
      )}
    </div>
  );
};
