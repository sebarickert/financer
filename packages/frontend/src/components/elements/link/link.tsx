import clsx from 'clsx';
import Link from 'next/link';

import { isExternalLink } from '../button/button';

interface LinkProps {
  className?: string;
  children: string;
  testId?: string;
  isAbsolute?: boolean;
  url: string;
}

export const Link = ({
  className = '',
  children,
  testId,
  isAbsolute,
  url,
}: LinkProps): JSX.Element => {
  const linkClasses = clsx('font-medium tracking-tight', {
    [className]: true,
  });
  const linkContent = (
    <>
      {isAbsolute && <span className="absolute inset-0" aria-hidden="true" />}
      {children}
    </>
  );

  if (isExternalLink(url)) {
    return (
      <a href={url} className={linkClasses} data-testid={testId}>
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={url} className={linkClasses} data-testid={testId}>
      {linkContent}
    </Link>
  );
};
