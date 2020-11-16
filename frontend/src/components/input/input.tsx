import React from "react";
import addLeadingZero from "../../utils/addLeadingZero";

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
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const currentDate = `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;

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
          className={`form-input block w-full sm:text-sm sm:leading-5 ${
            isCurrency && "pl-7"
          }`}
          aria-describedby={help && `${id}-description`}
          defaultValue={isDate ? currentDate : value}
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
