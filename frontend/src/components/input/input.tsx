import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { inputDateFormat } from '../../utils/formatDate';

interface IInputProps {
  children: React.ReactNode;
  help?: string;
  id: string;
  isCurrency?: boolean;
  isDate?: boolean;
  isRequired?: boolean;
  type?: 'text' | 'number' | 'datetime-local';
  value?: string | number;
  min?: number;
  max?: number;
  step?: number;
  ref?: React.MutableRefObject<null>;
  onChange?(event: ChangeEvent<HTMLInputElement>): void;
}

export const Input = ({
  children,
  help = '',
  id,
  isCurrency = false,
  isDate = false,
  isRequired = false,
  type = 'text',
  min,
  max,
  step,
  value = '',
  ref,
  onChange,
}: IInputProps): JSX.Element => {
  const formatValue = useCallback(
    (newValue: string | number) =>
      isDate && !newValue ? inputDateFormat(new Date()) : newValue,
    [isDate]
  );

  const [inputValue, setInputValue] = useState(formatValue(value));

  useEffect(() => {
    setInputValue(formatValue(value));
  }, [value, formatValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
    setInputValue(event.target.value);
  };
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase leading-5 tracking-wider text-gray-500"
      >
        {children}
      </label>
      <div className="mt-1 relative rounded-md">
        {isCurrency && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">€</span>
          </div>
        )}
        <input
          id={id}
          type={type}
          min={min}
          max={max}
          step={step}
          className={`appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-financer focus:border-blue-financer text-gray-900 ${
            isCurrency && 'pl-7'
          }`}
          aria-describedby={help && `${id}-description`}
          value={inputValue}
          required={isRequired}
          ref={ref}
          onChange={handleChange}
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
