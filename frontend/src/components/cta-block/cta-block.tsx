import React from 'react';

interface ICtaBlockProps {
  label?: string;
  className?: string;
  children: React.ReactNode;
}

export const CtaBlock = ({
  label = '',
  className = '',
  children,
}: ICtaBlockProps): JSX.Element => {
  return (
    <section
      className={`bg-white border p-2 rounded-lg whitespace-nowrap w-full ${className}`}
    >
      <nav aria-label={label}>
        <ul className="grid grid-cols-3 justify-center items-center">
          {children}
        </ul>
      </nav>
    </section>
  );
};
