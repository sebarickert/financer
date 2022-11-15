import { ReactComponent as Logo } from '../../../assets/logo.svg';

export const Loader = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center p-16">
      <Logo className="absolute block w-12 h-12 opacity-75 animate-ping" />
      <Logo className="relative block h-14 w-14" />
    </div>
  );
};
