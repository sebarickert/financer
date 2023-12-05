import clsx from 'clsx';

interface ButtonGroupProps {
  readonly children: React.ReactNode[];
  label?: string;
  isReverse?: boolean;
  isHorizontal?: boolean;
  className?: string;
}

export const ButtonGroup = ({
  children,
  label,
  className = '',
  isReverse,
  isHorizontal,
}: ButtonGroupProps): JSX.Element => {
  return (
    <div className={className}>
      {label && (
        <h2 className="mb-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {label}
        </h2>
      )}
      <div
        className={clsx('flex gap-2', {
          ['flex-col sm:flex-row']: isHorizontal,
          ['flex-row-reverse']: isHorizontal && isReverse,
          ['sm:flex-row-reverse']: isReverse && !isHorizontal,
        })}
      >
        {children}
      </div>
    </div>
  );
};
