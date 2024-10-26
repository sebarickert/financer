import clsx from 'clsx';
import { FC } from 'react';

import { Theme } from '$api/generated/financerApi';
import { Icon, IconName } from '$elements/Icon';

type ThemeSwitcherItemProps = {
  children: string;
  className?: string;
  value: string;
  name: string;
  isChecked?: boolean;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

const iconMapping: Record<Theme, IconName> = {
  [Theme.Light]: 'SunIcon',
  [Theme.Dark]: 'MoonIcon',
  [Theme.Auto]: 'SparklesIcon',
};

export const ThemeSwitcherItem: FC<ThemeSwitcherItemProps> = ({
  children,
  className = '',
  name,
  value,
  isChecked,
  onChange,
}) => {
  return (
    <label className={clsx('', className)} htmlFor={`${name}-${value}`}>
      <input
        id={`${name}-${value}`}
        name={name}
        type="radio"
        value={value}
        className={clsx('peer sr-only')}
        defaultChecked={isChecked}
        onChange={onChange}
      />
      <span
        className={clsx(
          'flex items-center justify-center text-sm py-2.5 rounded-md theme-text-primary',
          'peer-checked:font-medium peer-checked:theme-layer-secondary-color peer-checked:border peer-checked:theme-border-primary',
          'peer-focus-visible:theme-focus-without-prefix peer-hover:cursor-pointer',
        )}
      >
        <Icon name={iconMapping[children as Theme]} isSolid={isChecked} />
        <span className="sr-only">{children}</span>
      </span>
    </label>
  );
};
