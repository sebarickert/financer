import clsx from 'clsx';
import { FC } from 'react';

import { Icon, IconName } from '$elements/Icon';
import { Link } from '$elements/link/link';

interface LinkListLinkProps {
  icon?: IconName;
  children: React.ReactNode;
  link: string;
  testId?: string;
  entityTitle?: string;
  className?: string;
}

export const LinkListLink: FC<LinkListLinkProps> = ({
  icon,
  link,
  children,
  testId,
  className = '',
  entityTitle,
}) => {
  const linkClasses = clsx(
    'relative pl-4 pr-3 py-5',
    'flex gap-4 items-center',
    'theme-layer-color-with-hover',
    {
      [className]: true,
    },
  );

  const linkContent = (
    <>
      {icon && <Icon name={icon} />}
      <span className={clsx('flex-1')}>{children}</span>
      <Icon name="ChevronRightIcon" />
    </>
  );

  return (
    <Link
      href={link}
      className={linkClasses}
      testId={testId}
      data-entity-title={entityTitle ?? undefined}
      transition="slideInFromRight"
    >
      {linkContent}
    </Link>
  );
};
