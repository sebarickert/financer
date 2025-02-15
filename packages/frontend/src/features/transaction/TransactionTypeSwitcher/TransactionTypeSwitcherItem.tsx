import clsx from 'clsx';
import { FC } from 'react';

import { TransactionTypeIcon } from '../TransactionTypeIcon';

import { TransactionType } from '$api/generated/financerApi';

interface TransactionTypeSwitcherItemProps {
  children: string;
  className?: string;
  value: TransactionType;
  name: string;
  isChecked?: boolean;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

export const TransactionTypeSwitcherItem: FC<
  TransactionTypeSwitcherItemProps
> = ({ children, className = '', name, value, isChecked, onChange }) => {
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
          'flex items-center justify-center rounded-md py-2',
          'peer-checked:bg-background peer-checked:hover:bg-background peer-checked:active:bg-background',
          'peer-focus-visible:focus-highlight peer-hover:cursor-pointer peer-hover:bg-accent peer-active::bg-accent',
        )}
      >
        <TransactionTypeIcon type={value} />
        <span className="sr-only">{children}</span>
      </span>
    </label>
  );
};
