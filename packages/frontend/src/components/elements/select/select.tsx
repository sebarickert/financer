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
  defaultValue,
  className = '',
  testId,
  isDisabled = false,
  handleOnChange = () => {},
}: SelectProps): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!handleOnChange) return null;

    handleOnChange(event);
  };

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-medium leading-5 tracking-tight uppercase text-gray-darkest"
      >
        {children}
        <select
          data-testid={testId}
          id={id}
          name={id}
          className="block w-full py-3 pl-3 pr-10 mt-1 text-base font-normal tracking-tight rounded-md bg-gray border-gray-dark hover:bg-gray-dark text-charcoal focus:outline-none focus:ring-black focus:border-black hover:cursor-pointer"
          required={isRequired}
          aria-describedby={help && `${id}-description`}
          onChange={handleChange}
          defaultValue={defaultValue}
          disabled={isDisabled}
        >
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
