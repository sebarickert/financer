import { ReactComponent as Logo } from '../../assets/logo.svg';

export const Loader = (): JSX.Element => {
  return (
    <div className="flex justify-center items-center p-16">
      <Logo className="animate-ping absolute block h-12 w-12 opacity-75" />
      <Logo className="relative block h-14 w-14" />
    </div>
  );
};
