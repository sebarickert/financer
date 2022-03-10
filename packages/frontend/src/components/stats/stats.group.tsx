import React from 'react';

interface IStatsProps {
  children: React.ReactNode[];
  className?: string;
}

export const StatsGroup = ({
  children,
  className = '',
}: IStatsProps): JSX.Element => {
  return (
    <section className={`${className}`}>
      <div
        className={`grid bg-white rounded-lg border divide-x ${
          children.filter((child) => typeof child !== 'undefined' && child)
            .length %
            3 ===
          0
            ? 'md:grid-cols-3'
            : 'grid-cols-2'
        }`}
      >
        {children}
      </div>
    </section>
  );
};
