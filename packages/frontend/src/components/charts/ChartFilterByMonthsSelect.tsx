// 'use client';

import clsx from 'clsx';
import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';

type ChartFilterByMonthsSelectProps = {
  onFilterSelect: Dispatch<
    SetStateAction<
      (typeof monthFilterOptions)[keyof typeof monthFilterOptions]['value']
    >
  >;
  dataCount: number;
  className?: string;
  defaultValue?: number;
};

export const monthFilterOptions = {
  THREE_MONTHS: {
    label: 'Last 3 Months',
    value: 3,
  },
  SIX_MONTHS: {
    label: 'Last 6 Months',
    value: 6,
  },
  TWELVE_MONTHS: {
    label: 'Last 12 Months',
    value: 12,
  },
  TWENTYFOUR_MONTHS: {
    label: 'Last 24 Months',
    value: 24,
  },
  ALL: {
    label: 'Full History',
    value: 0,
  },
} as const;

export const ChartFilterByMonthsSelect: FC<ChartFilterByMonthsSelectProps> = ({
  onFilterSelect,
  dataCount,
  className,
  defaultValue,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(
      event.target.value,
    ) as (typeof monthFilterOptions)[keyof typeof monthFilterOptions]['value'];

    onFilterSelect(value);
  };

  const filteredOptions = Object.values(monthFilterOptions).filter(
    ({ value }) => {
      const {
        THREE_MONTHS,
        SIX_MONTHS,
        TWENTYFOUR_MONTHS,
        TWELVE_MONTHS,
        ALL,
      } = monthFilterOptions;

      if (dataCount <= 3) {
        return value === THREE_MONTHS.value;
      }

      if (dataCount < 6) {
        return value === THREE_MONTHS.value || value === ALL.value;
      }

      if (dataCount === 6) {
        return value === THREE_MONTHS.value || value === SIX_MONTHS.value;
      }

      if (dataCount < 12) {
        return (
          value === THREE_MONTHS.value ||
          value === SIX_MONTHS.value ||
          value === ALL.value
        );
      }

      if (dataCount === 12) {
        return (
          value === THREE_MONTHS.value ||
          value === SIX_MONTHS.value ||
          value === TWELVE_MONTHS.value
        );
      }

      if (dataCount < 24) {
        return (
          value === THREE_MONTHS.value ||
          value === SIX_MONTHS.value ||
          value === TWELVE_MONTHS.value ||
          value === ALL.value
        );
      }

      if (dataCount === 24) {
        return (
          value === THREE_MONTHS.value ||
          value === SIX_MONTHS.value ||
          value === TWELVE_MONTHS.value ||
          value === TWENTYFOUR_MONTHS.value
        );
      }

      return true;
    },
  );

  return (
    <select
      className={clsx(
        className,
        'theme-field-inverse',
        'block rounded-md',
        'py-3 h-12',
      )}
      defaultValue={defaultValue}
      onChange={handleChange}
    >
      {filteredOptions.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
