import React from 'react';

interface IProps {
  children: string;
}

export const StatsHeader = ({ children }: IProps): JSX.Element => {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-4">
      {children}
    </h2>
  );
};
