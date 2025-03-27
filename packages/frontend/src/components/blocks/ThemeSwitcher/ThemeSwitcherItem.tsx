import clsx from 'clsx';
import { LucideIcon, Moon, Settings2, Sun } from 'lucide-react';
import { FC } from 'react';

import { Theme } from '@/api/ssr-financer-api';
import { hapticRunner } from '@/utils/haptic.helper';

interface ThemeSwitcherItemProps {
  children: string;
  className?: string;
  value: string;
  name: string;
  isChecked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const THEME_SWITCHER_ICON_MAPPING: Record<Theme, LucideIcon> = {
  [Theme.LIGHT]: Sun,
  [Theme.DARK]: Moon,
  [Theme.AUTO]: Settings2,
};

export const ThemeSwitcherItem: FC<ThemeSwitcherItemProps> = ({
  children,
  className = '',
  name,
  value,
  isChecked,
  onChange,
}) => {
  const Icon = THEME_SWITCHER_ICON_MAPPING[children as Theme];

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
        onClick={() => {
          hapticRunner('medium');
        }}
      />
      <span
        className={clsx(
          'py-2',
          'flex items-center justify-center rounded-md text-muted-foreground',
          'peer-checked:bg-accent peer-checked:hover:bg-accent peer-checked:text-foreground peer-checked:hover:text-foreground',
          'peer-focus-visible:focus-highlight peer-hover:cursor-pointer peer-hover:bg-accent peer-hover:text-foreground',
        )}
      >
        <Icon className="size-5" />
        <span className="sr-only">{children}</span>
      </span>
    </label>
  );
};
