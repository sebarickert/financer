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
  isLabelHidden?: boolean;
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
  isLabelHidden,
}: InputProps): JSX.Element => {
  const { register } = useFormContext();

  return (
    <div className="text-[--color-text-primary]">
      <label
        htmlFor={id}
        className={clsx('block mb-1', { 'sr-only': isLabelHidden })}
      >
        {children}
      </label>
      <input
        id={id}
        type={type}
        inputMode={type === 'number' ? 'decimal' : undefined}
        min={min}
        max={max}
        step={step}
        className={clsx('theme-field', 'block w-full py-3 h-12 rounded-md')}
        required={isRequired}
        data-testid={testId}
        placeholder={isLabelHidden ? (children as string) : undefined}
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
