import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import { InputHTMLAttributes, type JSX } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  Icon?: LucideIcon;
  children: string;
  register?: UseFormRegisterReturn;
  type: 'radio' | 'checkbox';
};

export const InputOption = ({
  id,
  children,
  value,
  Icon,
  register,
  type,
  ...attributes
}: RadioProps): JSX.Element => {
  const labelId = `${id}-${value}-label`;

  return (
    <label
      className={clsx('relative')}
      htmlFor={`${id}-${value}`}
      aria-labelledby={labelId}
    >
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
          'peer-focus-visible:focus-highlight peer-hover:bg-accent peer-active:bg-accent',
          'peer-checked:bg-blue/15 peer-checked:border-blue peer-checked:[&_[data-slot="indicator"]]:after:block peer-checked:[&_[data-slot="indicator"]]:border-blue',
          type === 'radio' &&
            'peer-checked:hover:bg-blue/15 peer-checked:active:bg-blue/15',
          type === 'checkbox' &&
            'peer-checked:hover:bg-blue/25 peer-checked:active:bg-blue/25',
        )}
      >
        {Icon && <Icon className="w-7 h-7 shrink-0" />}
        <p className="font-medium grow" id={labelId}>
          {children}
        </p>
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
