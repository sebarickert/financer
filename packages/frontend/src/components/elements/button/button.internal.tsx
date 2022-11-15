import { Link } from 'react-router-dom';

interface ButtonInternalProps {
  children: React.ReactNode;
  className: string;
  link: string;
  onClick?(): void;
  testId?: string;
}

export const ButtonInternal = ({
  children,
  className,
  link,
  onClick,
  testId,
}: ButtonInternalProps): JSX.Element => {
  return (
    <Link
      to={link}
      className={className}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </Link>
  );
};
