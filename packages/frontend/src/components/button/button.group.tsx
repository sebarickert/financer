import React from 'react';

interface IButtonGroupProps {
  readonly children: React.ReactNode[];
  label?: string;
  isReverse?: boolean;
  isHorizontal?: boolean;
  className?: string;
}

export const ButtonGroup = ({
  children,
  label,
  className = '',
  isReverse,
  isHorizontal,
}: IButtonGroupProps): JSX.Element => {
  return (
    <div className={className}>
      {label && (
        <h2 className="text-2xl leading-9 font-bold tracking-tight text-gray-900 mb-4">
          {label}
        </h2>
      )}
      <div
        className={`${isHorizontal ? 'flex' : 'flex flex-col sm:flex-row'} ${
          isHorizontal && isReverse ? 'flex-row-reverse' : ''
        } ${isReverse && !isHorizontal ? 'sm:flex-row-reverse' : ''} gap-3`}
      >
        {children}
      </div>
    </div>
  );
};
