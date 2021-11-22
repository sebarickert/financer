import React from 'react';

interface IStatsItemProps {
  children: string;
  statLabel: string;
  testId?: string;
}

export const StatsItem = ({
  children,
  statLabel,
  testId,
}: IStatsItemProps): JSX.Element => {
  return (
    <div className="relative group bg-white p-6 rounded-lg border">
      <dl data-testId={testId}>
        <dt className="text-sm font-medium truncate mb-2">{statLabel}</dt>
        <dd className="text-2xl font-bold tracking-tight">{children}</dd>
      </dl>
    </div>
  );
};
