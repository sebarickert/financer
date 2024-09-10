interface ButtonPlainProps {
  children: React.ReactNode;
  onClick?(): void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
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
}: ButtonPlainProps): JSX.Element => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} disabled:cursor-not-allowed disabled:text-opacity-25`}
      data-testid={testId}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};
