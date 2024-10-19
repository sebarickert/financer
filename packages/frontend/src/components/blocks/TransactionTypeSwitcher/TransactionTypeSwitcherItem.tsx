import clsx from 'clsx';
import { FC } from 'react';

type TransactionTypeSwitcherItemProps = {
  children: string;
  className?: string;
  value: string;
  name: string;
  isChecked?: boolean;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

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
          'flex items-center justify-center text-sm text-black py-2.5 rounded-md',
          'peer-checked:font-medium peer-checked:bg-white peer-checked:border peer-checked:border-gray-dark',
        )}
      >
        {children}
      </span>
    </label>
  );
};
