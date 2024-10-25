import clsx from 'clsx';

interface ButtonGroupProps {
  readonly children: React.ReactNode[];
  isReverse?: boolean;
  isHorizontal?: boolean;
  className?: string;
}

export const ButtonGroup = ({
  children,
  className = '',
  isReverse,
  isHorizontal,
}: ButtonGroupProps): JSX.Element => {
  return (
    <div className={className}>
      <div
        className={clsx('flex gap-2', {
          ['flex-col lg:flex-row']: isHorizontal,
          ['flex-row-reverse']: isHorizontal && isReverse,
          ['sm:flex-row-reverse']: isReverse && !isHorizontal,
        })}
      >
        {children}
      </div>
    </div>
  );
};
