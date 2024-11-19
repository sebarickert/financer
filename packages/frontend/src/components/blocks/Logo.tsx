import clsx from 'clsx';
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

const LogoIcon = () => (
  <Image
    src="/logo.svg"
    alt="Financer logo"
    className="rounded w-9 h-9"
    width={48}
    height={48}
  />
);

export const Logo = ({ className }: LogoProps): JSX.Element => {
  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <LogoIcon />
      <h2 className={clsx('text-xl font-semibold tracking-tight ')}>
        Financer
      </h2>
    </div>
  );
};

Logo.Icon = LogoIcon;
