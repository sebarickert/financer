import { clsx } from 'clsx';
import React, { Children, cloneElement } from 'react';

export interface CtaBlockProps {
  label?: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'gray' | 'black' | 'brand';
}

export const CtaBlock = ({
  label = '',
  className = '',
  children,
  variant = 'gray',
}: CtaBlockProps): JSX.Element => {
  return (
    <section className={clsx(className)}>
      <nav aria-label={label}>
        <ul
          className={clsx('grid grid-cols-4 gap-2 justify-center items-center')}
        >
          {Children.map(children, (child) => {
            return cloneElement(child as React.ReactElement, { variant });
          })}
        </ul>
      </nav>
    </section>
  );
};
