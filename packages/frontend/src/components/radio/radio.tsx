import React from 'react';

interface RadioProps {
  children: string;
  className?: string;
  value: string;
  name: string;
  isChecked?: boolean;
}

export const Radio = ({
  children,
  className = '',
  name,
  value,
  isChecked,
}: RadioProps): JSX.Element => {
  return (
    <label
      className={`flex items-center p-4 gap-4 rounded hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer ${className}`}
      htmlFor={`${name}-${value}`}
    >
      <div className="flex items-center h-5">
        <input
          id={`${name}-${value}`}
          name={name}
          type="radio"
          value={value}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          defaultChecked={isChecked}
        />
      </div>
      <span className="text-base font-medium text-gray-900 dark:text-gray-300">
        {children}
      </span>
    </label>
  );
};
