import clsx from 'clsx';
import React, { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';

type InputProps = {
  children: React.ReactNode;
  help?: string;
  id: string;
  isRequired?: boolean;
  type?: 'text' | 'number' | 'datetime-local';
  value?: string | number;
  min?: number;
  max?: number;
  step?: number;
  ref?: React.MutableRefObject<null>;
  onChange?(event: ChangeEvent<HTMLInputElement>): void;
  testId?: string;
};

const getValueParsingOptions = (type: InputProps['type']) => {
  if (type === 'number') return { valueAsNumber: true };
  if (type === 'datetime-local') return { valueAsDate: true };

  return {};
};

export const Input = ({
  children,
  id,
  isRequired = false,
  type = 'text',
  min,
  max,
  step,
  testId,
}: InputProps): JSX.Element => {
  const { register } = useFormContext();

  return (
    <div className="theme-text-primary">
      <label htmlFor={id} className="block">
        {children}
      </label>
      <input
        id={id}
        type={type}
        inputMode={type === 'number' ? 'decimal' : undefined}
        min={min}
        max={max}
        step={step}
        className={clsx('theme-field', 'block w-full p-3 rounded-md mt-1')}
        required={isRequired}
        data-testid={testId}
        {...register(id, {
          min,
          max,
          required: isRequired,
          ...getValueParsingOptions(type),
        })}
      />
    </div>
  );
};
