interface ButtonExternalProps {
  children: React.ReactNode;
  className: string;
  link: string;
  onClick?(): void;
  testId?: string;
}

export const ButtonExternal = ({
  children,
  className,
  link,
  onClick,
  testId,
}: ButtonExternalProps): JSX.Element => {
  return (
    <a href={link} className={className} onClick={onClick} data-testid={testId}>
      {children}
    </a>
  );
};
