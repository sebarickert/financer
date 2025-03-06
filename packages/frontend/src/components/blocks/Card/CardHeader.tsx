import clsx from 'clsx';
import { FC, ReactNode } from 'react';

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={clsx(className, 'px-6 py-6 -mx-6 -mt-6')}>{children}</div>
  );
};
