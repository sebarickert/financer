import clsx from 'clsx';
import { ChangeEvent, FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Icon, IconName } from '$elements/Icon';

interface SelectProps {
  children: React.ReactNode;
  help?: string;
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
}

export interface Option {
  value: string;
  label: string;
  icon?: IconName;
  description?: string;
}

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
    <div className="flex flex-row gap-4 items-center">
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
  help = '',
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
    <div className={className}>
      <label htmlFor={id} className="block text-sm text-black">
        {children}
        <select
          data-testid={testId}
          id={id}
          className="relative block w-full py-3 pl-3 pr-10 mt-1 text-base font-normal tracking-normal border border-transparent rounded-md bg-gray text-charcoal focus:outline-none focus:ring-black focus:border-black hover:cursor-pointer"
          required={isRequired}
          aria-describedby={help && `${id}-description`}
          disabled={isDisabled}
          {...register(id, {
            disabled: isDisabled,
            onChange: handleChange,
            required: isRequired,
            shouldUnregister,
          })}
        >
          <button className="after:absolute after:inset-0">
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
      {help && (
        <p className="mt-2 text-sm text-charcoal" id={`${id}-description`}>
          {help}
        </p>
      )}
    </div>
  );
};
