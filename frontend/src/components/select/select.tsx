import React from "react";

interface IProps {
  children: React.ReactNode;
  help?: string;
  id: string;
  isRequired?: boolean;
  options: IOption[];
  defaultValue?: string;
  className?: string;
}

export interface IOption {
  value: string;
  label: string;
}

const Select = ({
  children,
  help = "",
  id,
  isRequired = false,
  options,
  defaultValue,
  className = "",
}: IProps): JSX.Element => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase leading-5 tracking-wider text-gray-500"
      >
        {children}
        <select
          id={id}
          name={id}
          defaultValue={defaultValue}
          className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-financer focus:border-blue-financer rounded-md text-gray-900"
          required={isRequired}
          aria-describedby={help && `${id}-description`}
        >
          {options.map(({ value, label }) => (
            <option value={value} key={value}>
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

export default Select;
