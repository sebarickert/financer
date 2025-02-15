import clsx from 'clsx';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { FC } from 'react';

import { Link } from '$elements/Link';

interface ProminentLinkProps {
  Icon?: LucideIcon;
  children: React.ReactNode;
  link: string;
  testId?: string;
  entityTitle?: string;
  className?: string;
}

export const ProminentLink: FC<ProminentLinkProps> = ({
  Icon,
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
        'bg-layer hover:bg-accent active:bg-accent',
        {
          [className]: true,
        },
      )}
      testId={testId}
      data-entity-title={entityTitle ?? undefined}
      transition="slideInFromRight"
      hasHoverEffect={false}
    >
      {Icon && <Icon />}
      <span className={clsx('flex-1')}>{children}</span>
      <ChevronRight />
    </Link>
  );
};
