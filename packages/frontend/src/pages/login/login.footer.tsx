import { Link } from '../../components/elements/link/link';

interface LoginFooterProps {
  className: string;
}

export const LoginFooter = ({
  className = '',
}: LoginFooterProps): JSX.Element => {
  return (
    <div
      className={`${className} text-gray-dark flex gap-8 justify-end text-sm`}
    >
      <Link url="/privacy-policy">Privacy policy</Link>
      <Link url="/issues-with-login">Issues with login?</Link>
    </div>
  );
};
