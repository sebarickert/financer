import clsx from 'clsx';
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

const LogoIcon = () => (
  <Image
    src="/logo.svg"
    alt="Financer logo"
    className="w-12 h-12"
    width={48}
    height={48}
  />
);

export const Logo = ({ className }: LogoProps): JSX.Element => {
  return (
    <div className={clsx('inline-flex items-center gap-3', className)}>
      <LogoIcon />
      <h2
        className={clsx(
          'font-semibold text-xl theme-text-primary tracking-normal uppercase',
        )}
      >
        Financer
      </h2>
    </div>
  );
};

Logo.Icon = LogoIcon;
