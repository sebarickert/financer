/* eslint-disable react/button-has-type */
import React from 'react';

interface IButtonPlainProps {
  children: string;
  onClick(): void;
  className: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  testId?: string;
  isDisabled?: boolean;
}

export const ButtonPlain = ({
  children,
  onClick,
  className,
  type = 'button',
  testId,
  isDisabled,
}: IButtonPlainProps): JSX.Element => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={children}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      data-testid={testId}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};
