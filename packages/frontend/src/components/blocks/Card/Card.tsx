import clsx from 'clsx';
import { FC, ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={clsx(className, 'bg-layer rounded-md p-6')}>{children}</div>
  );
};
