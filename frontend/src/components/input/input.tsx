import React from "react";
import { inputDateFormat } from "../../utils/formatDate";

interface IProps {
  children: React.ReactNode;
  help?: string;
  id: string;
  isCurrency?: boolean;
  isDate?: boolean;
  isRequired?: boolean;
  type?: "text" | "number" | "date";
  value?: string | number;
}

const Input = ({
  children,
  help = "",
  id,
  isCurrency = false,
  isDate = false,
  isRequired = false,
  type = "text",
  value = "",
}: IProps): JSX.Element => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-5 text-gray-700"
      >
        {children}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {isCurrency && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm sm:leading-5">€</span>
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            isCurrency && "pl-7"
          }`}
          aria-describedby={help && `${id}-description`}
          defaultValue={isDate && !value ? inputDateFormat(new Date()) : value}
          required={isRequired}
        />
      </div>
      {help && (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {help}
        </p>
      )}
    </div>
  );
};

export default Input;
