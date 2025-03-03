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
          'my-1 py-2',
          'flex items-center justify-center text-sm rounded-md',
          'peer-checked:bg-background peer-checked:hover:bg-background peer-checked:active:bg-background',
          'peer-focus-visible:focus-highlight peer-hover:cursor-pointer peer-hover:bg-accent peer-active:cursor-pointer peer-active::bg-accent',
        )}
      >
        <Icon />
        <span className="sr-only">{children}</span>
      </span>
    </label>
  );
};
