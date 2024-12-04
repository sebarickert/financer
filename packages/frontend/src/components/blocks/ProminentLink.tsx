import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { FC } from 'react';

import { Icon, IconName } from '$elements/Icon';
import { Link } from '$elements/Link';

type ProminentLinkProps = {
  icon?: IconName;
  children: React.ReactNode;
  link: string;
  testId?: string;
  entityTitle?: string;
  className?: string;
};

export const ProminentLink: FC<ProminentLinkProps> = ({
  icon,
  link,
  children,
  testId,
  className = '',
  entityTitle,
}) => {
  return (
    <Link
      haptic="light"
      href={link}
      className={clsx(
        'relative pl-4 pr-3 py-5',
        'flex gap-4 items-center',
        'bg-layer hover:bg-accent',
        {
          [className]: true,
        },
      )}
      testId={testId}
      data-entity-title={entityTitle ?? undefined}
      transition="slideInFromRight"
      hasHoverEffect={false}
    >
      {icon && <Icon name={icon} />}
      <span className={clsx('flex-1')}>{children}</span>
      <ChevronRight />
    </Link>
  );
};
