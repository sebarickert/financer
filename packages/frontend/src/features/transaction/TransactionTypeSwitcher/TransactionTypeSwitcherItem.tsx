import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { transactionTypeThemeMapping } from '$constants/transaction/transactionTypeMapping';
import { Icon } from '$elements/Icon';

type TransactionTypeSwitcherItemProps = {
  children: string;
  className?: string;
  value: TransactionType;
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
          'flex items-center justify-center rounded-md py-2',
          'peer-checked:theme-layer-secondary-color peer-checked:border peer-checked:',
          'peer-focus-visible:theme-focus-without-prefix peer-hover:cursor-pointer',
        )}
      >
        <Icon name={transactionTypeThemeMapping[value].icon} />
        <span className="sr-only">{children}</span>
      </span>
    </label>
  );
};
