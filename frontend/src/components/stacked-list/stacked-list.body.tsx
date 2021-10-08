import React from 'react';

interface IStackedListBodyProps {
  children: React.ReactNode;
}

export const StackedListBody = ({
  children,
}: IStackedListBodyProps): JSX.Element => {
  return (
    <div className="bg-white border border-gray-200 flex-1 -mx-4 lg:mx-0">
      <ul className="divide-y divide-gray-200">{children}</ul>
    </div>
  );
};
