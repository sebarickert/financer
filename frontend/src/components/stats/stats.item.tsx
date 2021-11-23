import React from 'react';

interface IStatsItemProps {
  children: string;
  statLabel: string;
  testId?: string;
  type?: 'standalone' | 'default';
}

export const StatsItem = ({
  children,
  statLabel,
  testId,
  type = 'default',
}: IStatsItemProps): JSX.Element => {
  if (type === 'standalone') {
    return (
      <dl data-testId={testId} className="pl-1">
        <dt className="text-sm text-gray-500 font-medium truncate lg:text-base">
          {statLabel}
        </dt>
        <dd className="text-2xl font-bold tracking-tight">{children}</dd>
      </dl>
    );
  }

  return (
    <dl data-testId={testId} className="p-4">
      <dt className="text-xs text-gray-500 lg:text-sm lg:mb-0.5">
        {statLabel}
      </dt>
      <dd className="text-lg font-semibold truncate lg:text-xl">{children}</dd>
    </dl>
  );
};
