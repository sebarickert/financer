import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

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
  const linkClasses = clsx({ [className]: true });
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
    <NavLink to={url} className={linkClasses} data-testid={testId}>
      {linkContent}
    </NavLink>
  );
};
