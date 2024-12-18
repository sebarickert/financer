import clsx from 'clsx';
import { FC, ReactNode } from 'react';

type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

export const CardHeader: FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={clsx(className, 'px-6 py-4.5 -mx-6 -mt-6')}>{children}</div>
  );
};
