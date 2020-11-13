import React from "react";

interface IProps {
  children: React.ReactNode;
  help?: string;
  id: string;
  isRequired?: boolean;
  options: IOption[];
}

export interface IOption {
  value: string;
  label: string;
  selected?: boolean;
}

const Select = ({
  children,
  help = "",
  id,
  isRequired = false,
  options,
}: IProps): JSX.Element => {
  const defaultValue = options.find((option) => option.selected)?.value;
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
          className="mt-1 form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
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
