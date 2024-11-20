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
  isLabelHidden?: boolean;
  isBleedingEdge?: boolean;
};

export type Option = {
  value: string;
  label: string;
  icon?: IconName;
  description?: string;
};

type OptionElementProps = Omit<Option, 'label'> & {
  hasIconPlaceholder?: boolean;
  children: string;
  isDisabled?: boolean;
};

const OptionElement: FC<OptionElementProps> = ({
  value,
  children,
  icon,
  description,
  hasIconPlaceholder = false,
  isDisabled,
}) => (
  <option
    value={value}
    key={value}
    className={clsx(
      'theme-focus focus-visible:z-10 focus-visible:relative text-foreground rounded-md hover:cursor-pointer hover:bg-accent',
      'disabled:pointer-events-none disabled:opacity-50',
      'before:hidden p-3 flex gap-2',
    )}
    disabled={isDisabled}
  >
    {icon && <Icon name={icon} />}
    {!icon && hasIconPlaceholder && <span className="w-6" />}
    <span
      className={clsx(
        'grid text-base text-left',
        'after:content-[attr(data-description)] after:text-sm after:text-muted-foreground',
      )}
      data-description={description}
    >
      {children}
    </span>
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
  isLabelHidden,
  isBleedingEdge = true,
}: SelectProps): JSX.Element => {
  const { register } = useFormContext();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!handleOnChange) return null;

    handleOnChange(event);
  };

  const hasSomeOptionIcon = options.some((option) => option.icon);

  return (
    <div className={clsx('text-foreground', className)}>
      <label
        htmlFor={id}
        className={clsx('block mb-1', { 'sr-only': isLabelHidden })}
      >
        {children}
      </label>
      <select
        data-testid={testId}
        data-bleeding-edge={isBleedingEdge ? 'on' : 'off'}
        id={id}
        className={clsx(
          'theme-field',
          'block w-full rounded-md',
          'py-3 h-12',
          'supports-[selector(::picker(select))]:[&:has(button:focus-visible)]:theme-focus-without-prefix',
          {
            'supports-[selector(::picker(select))]:p-0': isBleedingEdge,
          },
        )}
        required={isRequired}
        disabled={isDisabled}
        {...register(id, {
          disabled: isDisabled,
          onChange: handleChange,
          required: isRequired,
          shouldUnregister,
        })}
      >
        <button type="button" className="block w-full px-3">
          {/* @ts-expect-error - New experimental feature that is not yet supported by the TypeScript compiler */}
          <selectedoption
            className={clsx('[&>span]:after:hidden', 'py-3 flex gap-2 w-full')}
          />
        </button>
        <OptionElement
          isDisabled
          value=""
          hasIconPlaceholder={hasSomeOptionIcon}
        >
          {placeholder}
        </OptionElement>
        {options.map(({ label, ...rest }) => (
          <OptionElement
            key={rest.value}
            {...rest}
            hasIconPlaceholder={!rest.icon && hasSomeOptionIcon}
          >
            {label}
          </OptionElement>
        ))}
      </select>
    </div>
  );
};
