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
    <label
      className={`flex items-center p-4 gap-4 rounded hover:bg-gray-50 hover:cursor-pointer`}
      htmlFor={id}
    >
      <div className="flex items-center h-5">
        <input
          id={id}
          name={id}
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
          defaultChecked={checked}
        />
      </div>
      <span className="text-base font-medium text-gray-900">{label}</span>
    </label>
  );
};
