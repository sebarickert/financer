import React from "react";

interface IProps {
  children: React.ReactNode;
  help?: string;
  id: string;
  isRequired?: boolean;
  options: IOption[];
  defaultValue?: string;
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
}: IProps): JSX.Element => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm leading-5 font-medium text-gray-700"
      >
        {children}
        <select
          id={id}
          name={id}
          defaultValue={defaultValue}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
