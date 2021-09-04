import React from "react";

interface IProps {
  id: string;
  label: string;
  checked?: boolean;
}

const Checkbox = ({ id, label, checked = false }: IProps): JSX.Element => {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={id}
          type="checkbox"
          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
          defaultChecked={checked}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
