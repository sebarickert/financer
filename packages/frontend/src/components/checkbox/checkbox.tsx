import React from 'react';

interface ICheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
}

export const Checkbox = ({
  id,
  label,
  checked = false,
}: ICheckboxProps): JSX.Element => {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={id}
          type="checkbox"
          className="focus:ring-financer-blue h-4 w-4 text-financer-blue border-gray-300 rounded hover:cursor-pointer"
          defaultChecked={checked}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={id}
          className="font-medium text-gray-700 hover:cursor-pointer"
        >
          {label}
        </label>
      </div>
    </div>
  );
};
