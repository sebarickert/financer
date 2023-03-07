import clsx from 'clsx';
import React, { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';

interface InputProps {
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
  testId?: string;
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
  testId,
}: InputProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const hasError = Object.keys(errors).includes(id);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium leading-5 tracking-tight uppercase text-gray-darkest"
      >
        {children}
      </label>
      <div className="relative mt-1 rounded-md">
        {isCurrency && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-charcoal">€</span>
          </div>
        )}
        <input
          id={id}
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          min={min}
          max={max}
          step={step}
          className={clsx(
            'appearance-none block w-full px-3 py-3 border border-gray-dark bg-gray rounded-md focus:outline-none focus:ring-black focus:border-black text-charcoal tracking-tight',
            { ['pl-7']: isCurrency }
          )}
          aria-describedby={help && `${id}-description`}
          required={isRequired}
          data-testid={testId}
          {...register(id, {
            min,
            max,
            required: isRequired,
            valueAsNumber: type === 'number',
          })}
        />
      </div>
      {help && (
        <p className="mt-2 text-sm text-charcoal" id={`${id}-description`}>
          {help}
        </p>
      )}
    </div>
  );
};
