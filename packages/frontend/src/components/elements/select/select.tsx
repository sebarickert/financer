import clsx from 'clsx';
import { ChangeEvent, FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Icon, IconName } from '$elements/Icon';

type SelectProps = {
  children: React.ReactNode;
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  options: Option[];
  defaultValue?: string;
  className?: string;
  handleOnChange?(event: React.ChangeEvent<HTMLSelectElement>): void;
  testId?: string;
  placeholder?: string;
  shouldUnregister?: boolean;
};

export type Option = {
  value: string;
  label: string;
  icon?: IconName;
  description?: string;
};

// @ts-expect-error - New experimental feature that is not yet supported by the TypeScript compiler
const SelectedOption: FC = () => <selectedoption></selectedoption>;

type OptionElementProps = Omit<Option, 'label'> & {
  isLast?: boolean;
  hasIconPlaceholder?: boolean;
  children: string;
  isDisabled?: boolean;
};

const OptionElement: FC<OptionElementProps> = ({
  value,
  children,
  icon,
  description,
  isLast = false,
  hasIconPlaceholder = false,
  isDisabled,
}) => (
  <option
    value={value}
    key={value}
    className={clsx('before:hidden px-2', {
      'mb-2': !isLast,
    })}
    disabled={isDisabled}
  >
    <div className="flex flex-row items-center gap-4">
      {icon && <Icon name={icon} className="text-gray-darkest" />}
      {!icon && hasIconPlaceholder && <span className="w-6" />}
      <div className="flex flex-col gap-1">
        <span
          className="option-label-after-from-data contents after:text-xs after:text-gray-darkest"
          data-description={description}
        >
          {children}
        </span>
      </div>
    </div>
  </option>
);

export const Select = ({
  children,
  id,
  isRequired = false,
  options,
  className = '',
  testId,
  isDisabled = false,
  placeholder = 'Select option',
  handleOnChange = () => {},
  shouldUnregister,
}: SelectProps): JSX.Element => {
  const { register } = useFormContext();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!handleOnChange) return null;

    handleOnChange(event);
  };

  const hasSomeOptionIcon = options.some((option) => option.icon);

  return (
    <div className={clsx('theme-text-primary', className)}>
      <label htmlFor={id} className="block">
        {children}
        <select
          data-testid={testId}
          id={id}
          className={clsx('theme-field', 'block w-full p-3 rounded-md mt-1')}
          required={isRequired}
          disabled={isDisabled}
          {...register(id, {
            disabled: isDisabled,
            onChange: handleChange,
            required: isRequired,
            shouldUnregister,
          })}
        >
          <button type="button" className="after:absolute after:inset-0">
            <SelectedOption />
          </button>
          <OptionElement
            isDisabled
            value=""
            hasIconPlaceholder={hasSomeOptionIcon}
          >
            {placeholder}
          </OptionElement>
          {options.map(({ label, ...rest }, index) => (
            <OptionElement
              key={rest.value}
              {...rest}
              hasIconPlaceholder={!rest.icon && hasSomeOptionIcon}
              isLast={index === options.length - 1}
            >
              {label}
            </OptionElement>
          ))}
        </select>
      </label>
    </div>
  );
};
