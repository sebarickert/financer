import clsx from 'clsx';
import { FC } from 'react';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container: FC<ContainerProps> = ({ className, children }) => {
  return (
    <div className={clsx('mx-auto max-w-screen-xl', className)}>{children}</div>
  );
};
