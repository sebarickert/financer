'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';
import { useFormContext } from 'react-hook-form';

import { AccountType } from '$api/generated/financerApi';
import { accountTypeMapping } from '$constants/account/accountTypeMapping';
import { Icon } from '$elements/Icon';

type AccountTypeRadioProps = {
  id: string;
  value: AccountType;
};

export const AccountTypeRadio: FC<AccountTypeRadioProps> = ({ id, value }) => {
  const labelId = `label_${useId()}`;
  const descriptionId = `description_${useId()}`;
  const { register } = useFormContext();

  return (
    <label
      htmlFor={`${id}-${value}`}
      className="relative"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
    >
      <input
        id={`${id}-${value}`}
        type="radio"
        className={clsx('peer sr-only w-full h-full')}
        value={value}
        required
        {...register(id, { required: true })}
      />
      <div
        className={clsx(
          'grid grid-cols-[auto,1fr] gap-4 bg-layer h-full',
          'p-4 rounded-md border relative',
          'peer-focus-visible:focus-highlight peer-hover:bg-accent',
          'before:w-4 before:h-4 before:rounded-full before:bg-background before:absolute before:right-5 before:border before:border-accent before:top-5 before:-translate-y-1/2 before:translate-x-1/2',
          'after:hidden after:w-2 after:h-2 after:rounded-full after:bg-blue after:absolute after:right-5 after:top-5 after:-translate-y-1/2 after:translate-x-1/2',
          'peer-checked:bg-blue/15 peer-checked:border-blue peer-checked:hover:bg-blue/15 peer-checked:after:block peer-checked:before:border-blue',
        )}
      >
        <Icon name={accountTypeMapping[value].icon} className="w-7 h-7" />
        <div>
          <p className="pr-6 font-medium" id={labelId}>
            {accountTypeMapping[value].label}
          </p>
          <p className="mt-1 text-sm text-muted-foreground" id={descriptionId}>
            {accountTypeMapping[value].description}
          </p>
        </div>
      </div>
    </label>
  );
};
