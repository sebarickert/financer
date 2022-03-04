import React from 'react';

interface IStackedListBodyProps {
  children: React.ReactNode;
}

export const StackedListBody = ({
  children,
}: IStackedListBodyProps): JSX.Element => {
  return (
    <ul className="border rounded-lg overflow-hidden divide-y">{children}</ul>
  );
};
