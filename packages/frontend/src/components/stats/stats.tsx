import React from 'react';

import { StatsHeader } from './stats.header';

interface IStatsProps {
  children: React.ReactNode[];
  label?: string;
  className?: string;
}

export const Stats = ({
  children,
  label,
  className = '',
}: IStatsProps): JSX.Element => {
  return (
    <section className={`${className}`}>
      {label && <StatsHeader>{label}</StatsHeader>}
      <div className="grid gap-2 md:gap-4">{children}</div>
    </section>
  );
};
