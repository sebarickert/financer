import clsx from 'clsx';
import { FC } from 'react';

import { IconName } from '$elements/Icon';

type TransactionTypeSwitcherItemProps = {
  icon: IconName;
  children: string;
  className?: string;
  value: string;
  name: string;
  isChecked?: boolean;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

export const TransactionTypeSwitcherItem: FC<
  TransactionTypeSwitcherItemProps
> = ({ icon, children, className = '', name, value, isChecked, onChange }) => {
  return (
    <label
      className={clsx(
        'flex items-center p-4 gap-4 rounded-md hover:bg-gray focus-within:bg-gray hover:cursor-pointer',
        className,
      )}
      htmlFor={`${name}-${value}`}
    >
      <input
        id={`${name}-${value}`}
        name={name}
        type="radio"
        value={value}
        className={clsx(
          'w-6 h-6 text-dreamless-sleep bg-gray border-gray-dark focus:ring-dreamless-sleep focus:ring-2 peer',
        )}
        defaultChecked={isChecked}
        onChange={onChange}
      />
      <span
        className={clsx(
          'text-base tracking-tight text-black peer-checked:font-medium',
        )}
      >
        {children}
      </span>
    </label>
  );
};
