import clsx from 'clsx';
import { FC } from 'react';

import { Theme } from '$api/generated/financerApi';
import { Icon, IconName } from '$elements/Icon';
import { hapticRunner } from '$utils/haptic.helper';

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
        onClick={() => hapticRunner('medium')}
      />
      <span
        className={clsx(
          'my-1 py-2',
          'flex items-center justify-center text-sm rounded-md',
          'peer-checked:bg-background peer-checked:hover:bg-background',
          'peer-focus-visible:focus-highlight peer-hover:cursor-pointer peer-hover:bg-accent',
        )}
      >
        <Icon name={iconMapping[children as Theme]} isSolid={isChecked} />
        <span className="sr-only">{children}</span>
      </span>
    </label>
  );
};
