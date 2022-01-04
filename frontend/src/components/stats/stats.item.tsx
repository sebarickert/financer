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
  testId = '',
  type = 'default',
}: IStatsItemProps): JSX.Element => {
  const testIdPostfix = testId ? `_${testId}` : '';

  if (type === 'standalone') {
    return (
      <dl data-testid={`stats-item${testIdPostfix}`} className="pl-1">
        <dt
          className="text-sm font-medium text-gray-500 truncate lg:text-base"
          data-testid={`stats-item-label${testIdPostfix}`}
        >
          {statLabel}
        </dt>
        <dd
          className="text-2xl font-bold tracking-tight"
          data-testid={`stats-item-content${testIdPostfix}`}
        >
          {children}
        </dd>
      </dl>
    );
  }

  return (
    <dl data-testid={`stats-item${testIdPostfix}`} className="p-4">
      <dt
        className="text-xs text-gray-500 lg:text-sm lg:mb-0.5"
        data-testid={`stats-item-label${testIdPostfix}`}
      >
        {statLabel}
      </dt>
      <dd
        className="text-lg font-semibold truncate lg:text-xl"
        data-testid={`stats-item-content${testIdPostfix}`}
      >
        {children}
      </dd>
    </dl>
  );
};
