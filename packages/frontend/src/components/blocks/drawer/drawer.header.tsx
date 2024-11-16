'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
import { Icon } from '$elements/Icon';
import { Paragraph } from '$elements/Paragraph';
import { hapticRunner } from '$utils/haptic.helper';

type DrawerHeaderProps = {
  className?: string;
  heading?: string;
  children?: string;
  onClose?: () => void;
  id: string;
};

export const DrawerHeader: FC<DrawerHeaderProps> = ({
  className = '',
  onClose,
  children,
  heading,
  id,
}) => {
  return (
    <div
      className={clsx(
        'grid grid-cols-[1fr,48px] items-center gap-y-4',
        className,
      )}
    >
      {heading && (
        <>
          <Heading className="col-[1]" noMargin disableResponsiveSizing>
            {heading}
          </Heading>
          {children && (
            <Paragraph className="row-[2] col-span-full">{children}</Paragraph>
          )}
        </>
      )}
      <Button
        size="icon"
        onClick={() => {
          hapticRunner('light');
          onClose?.();
        }}
        accentColor="secondary"
        popoverTarget={id}
        popoverTargetAction="hide"
        className="col-[2] -my-2"
      >
        <Icon name="XMarkIcon" />
        <span className="sr-only">Close drawer</span>
      </Button>
    </div>
  );
};
