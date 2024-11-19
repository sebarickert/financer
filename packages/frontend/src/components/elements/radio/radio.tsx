import clsx from 'clsx';

interface RadioProps {
  children: string;
  className?: string;
  value: string;
  name: string;
  isChecked?: boolean;
}

export const Radio = ({
  children,
  className = '',
  name,
  value,
  isChecked,
}: RadioProps): JSX.Element => {
  return (
    <label
      className={clsx(
        'flex items-center p-4 gap-4 rounded-md theme-bg-color-with-hover hover:cursor-pointer',
        { [className]: true },
      )}
      htmlFor={`${name}-${value}`}
    >
      <input
        id={`${name}-${value}`}
        name={name}
        type="radio"
        value={value}
        className={clsx(
          'w-6 h-6 peer appearance-none',
          'theme-layer-color-with-hover border border-[--color-border-primary] text-blue-600',
        )}
        defaultChecked={isChecked}
      />
      <span>{children}</span>
    </label>
  );
};
