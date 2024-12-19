import clsx from 'clsx';
import { FC, HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const Card: FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(className, 'bg-layer rounded-md p-6')}
      {...props}
      data-slot="card"
    >
      {children}
    </div>
  );
};
