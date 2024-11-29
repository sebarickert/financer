import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { Icon, IconName } from '$elements/Icon';

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: IconName;
  children: string;
  register?: UseFormRegisterReturn;
  type: 'radio' | 'checkbox';
};

export const InputOption = ({
  id,
  children,
  value,
  icon,
  register,
  type,
  ...attributes
}: RadioProps): JSX.Element => {
  return (
    <label className={clsx('relative')} htmlFor={`${id}-${value}`}>
      <input
        id={`${id}-${value}`}
        type={type}
        value={value}
        name={!register ? id : undefined}
        className={clsx('peer sr-only h-full w-full')}
        {...attributes}
        {...register}
      />
      <div
        className={clsx(
          'flex items-center gap-4',
          'p-4 rounded-md border relative bg-layer h-full',
          'peer-focus-visible:focus-highlight peer-hover:bg-accent',
          'peer-checked:bg-blue/15 peer-checked:border-blue peer-checked:[&_[data-slot="indicator"]]:after:block peer-checked:[&_[data-slot="indicator"]]:border-blue',
          type === 'radio' && 'peer-checked:hover:bg-blue/15',
          type === 'checkbox' && 'peer-checked:hover:bg-blue/25',
        )}
      >
        {icon && <Icon name={icon} className="w-7 h-7 shrink-0" />}
        <span className="font-medium grow">{children}</span>
        <span
          aria-hidden="true"
          data-slot="indicator"
          className={clsx(
            'inline-block shrink-0 relative',
            'w-4 h-4 rounded-full bg-background border',
            'after:hidden after:w-2 after:h-2 after:rounded-full after:bg-blue after:absolute after:left-1/2 after:top-1/2 after:-translate-y-1/2 after:-translate-x-1/2',
          )}
        />
      </div>
    </label>
  );
};
