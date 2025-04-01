import clsx from 'clsx';
import Image from 'next/image';
import type { JSX } from 'react';

interface LogoProps {
  className?: string;
}

const LogoIcon = () => (
  <Image
    src="/logo.svg"
    alt="Financer logo"
    className="rounded size-8"
    width={48}
    height={48}
  />
);

export const Logo = ({ className }: LogoProps): JSX.Element => {
  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <LogoIcon />
      <h2 className={clsx('leading-0 font-medium text-white')}>Financer</h2>
    </div>
  );
};

Logo.Icon = LogoIcon;
