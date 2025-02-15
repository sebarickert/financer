import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import React, { ChangeEvent, type JSX } from 'react';
import { useFormContext } from 'react-hook-form';

import { FieldGroup } from './FieldGroup';

interface InputProps {
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
  Icon?: LucideIcon;
}

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
  Icon,
}: InputProps): JSX.Element => {
  const { register } = useFormContext();

  return (
    <div>
      <label
        htmlFor={id}
        className={clsx('block mb-2', { 'sr-only': isLabelHidden })}
      >
        {children}
      </label>
      <FieldGroup>
        {Icon && <Icon />}
        <input
          id={id}
          data-slot="control"
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
      </FieldGroup>
    </div>
  );
};
