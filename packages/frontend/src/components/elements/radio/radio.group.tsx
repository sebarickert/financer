import React, { Children, type JSX } from 'react';

interface RadioProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}

export const RadioGroup = ({
  children,
  className = '',
}: RadioProps): JSX.Element => {
  return (
    <ul className={`${className}`}>
      {Children.map(children, (child) => {
        return child && <li key={`Radio-${Math.random()}`}>{child}</li>;
      })}
    </ul>
  );
};
