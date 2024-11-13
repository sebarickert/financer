import clsx from 'clsx';
import { FC } from 'react';

type ButtonGroupProps = {
  readonly children: React.ReactNode[];
  className?: string;
};

export const ButtonGroup: FC<ButtonGroupProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={clsx('flex max-lg:flex-col gap-2', className)}>
      {children}
    </div>
  );
};
