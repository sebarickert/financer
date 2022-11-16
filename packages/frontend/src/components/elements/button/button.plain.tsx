interface ButtonPlainProps {
  children: React.ReactNode;
  onClick(): void;
  className?: string;
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
}: ButtonPlainProps): JSX.Element => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      data-testid={testId}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};
