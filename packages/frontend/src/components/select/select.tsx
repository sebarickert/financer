import React from 'react';

interface ISelectProps {
  children: React.ReactNode;
  help?: string;
  id: string;
  isRequired?: boolean;
  options: IOption[];
  defaultValue?: string;
  className?: string;
  handleOnChange?(event: React.ChangeEvent<HTMLSelectElement>): void;
  testId?: string;
}

export interface IOption {
  value?: string;
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
  handleOnChange = () => {},
}: ISelectProps): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!handleOnChange) return null;

    handleOnChange(event);
  };

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold leading-5 tracking-wider text-gray-500 uppercase"
      >
        {children}
        <select
          data-testid={testId}
          id={id}
          name={id}
          className="block w-full py-3 pl-3 pr-10 mt-1 text-base text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-financer focus:border-blue-financer"
          required={isRequired}
          aria-describedby={help && `${id}-description`}
          onChange={handleChange}
        >
          {options.map(({ value, label }) => (
            <option value={value} key={value} selected={value === defaultValue}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {help && (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {help}
        </p>
      )}
    </div>
  );
};
