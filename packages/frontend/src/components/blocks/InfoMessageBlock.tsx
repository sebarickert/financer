import clsx from 'clsx';
import { FC } from 'react';

import { Heading } from '$elements/Heading';
import { Icon, IconName } from '$elements/Icon';

type InfoMessageBlockProps = {
  title: string;
  children: React.ReactNode;
  icon?: IconName;
  action?: React.ReactNode;
};

export const InfoMessageBlock: FC<InfoMessageBlockProps> = ({
  icon,
  title,
  children,
  action,
}) => {
  return (
    <div
      className={clsx(
        'bg-layer flex flex-col items-center justify-center',
        'px-6 pt-8 pb-10 rounded-md text-center',
        'text-center',
      )}
    >
      {icon && (
        <div
          className={clsx(
            'mb-6 relative rounded-full h-20 w-20',
            'inline-flex items-center justify-center shrink-0 bg-accent',
          )}
        >
          <Icon name={icon} className="!w-10 !h-10" />
        </div>
      )}
      <Heading disableResponsiveSizing noMargin className="mb-2">
        {title}
      </Heading>
      <p className="max-w-lg mx-auto [&:has(+*)]:mb-6 text-muted-foreground">
        {children}
      </p>
      {action}
    </div>
  );
};
