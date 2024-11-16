import clsx from 'clsx';
import { forwardRef } from 'react';

import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
import { Icon } from '$elements/Icon';
import { Paragraph } from '$elements/Paragraph';

interface DrawerProps {
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
  testId?: string;
  id: string;
  heading?: string;
  description?: string;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    { className = '', onClose, children, testId, id, heading, description },
    ref,
  ) => {
    const drawerBaseClasses = clsx(
      // Backdrop
      'backdrop:bg-black/0 backdrop:ease-in backdrop:transition-all backdrop:!transition-allow-discrete',
      'backdrop:open:bg-black/80 backdrop:open:ease-out backdrop:open:transition-all backdrop:open:!transition-allow-discrete',
      'starting:open:bg-black/0',
      // Drawer animation
      'max-lg:translate-y-full lg:translate-x-full !transition-allow-discrete transition-all duration-100',
      'open:max-lg:translate-y-0 open:ease-out open:lg:translate-x-0 open:!transition-allow-discrete open:transition-all open:duration-200',
      'starting:open:max-lg:translate-y-full starting:open:lg:translate-x-full',
      // Drawer
      'theme-bg-color theme-text-primary fixed text-left',
      'max-lg:bottom-0 max-lg:inset-x-0 max-lg:top-auto max-lg:w-full',
      'lg:max-w-[600px] lg:w-full lg:left-auto lg:h-full',
      'max-lg:border-t lg:border-l theme-border-primary',
      'pt-0 pb-safe-offset-12 px-6 lg:px-8',
      'max-h-dvh',
      className,
    );

    return (
      <section
        className={drawerBaseClasses}
        popover="auto"
        id={id}
        data-testid={testId ?? 'drawer'}
        ref={ref}
        data-body-scroll-lock="on"
        data-body-no-pointer-events="on"
      >
        <div
          className={clsx(
            'flex justify-between items-center',
            'theme-bg-color z-10',
            'sticky top-0',
            'pt-2 pb-2 mb-8',
            'px-6 lg:px-8 -mx-6 lg:-mx-8',
            'border-b theme-border-primary',
          )}
        >
          <Heading noMargin disableResponsiveSizing>
            {heading}
          </Heading>
          <Button
            size="icon"
            onClick={onClose}
            haptic="light"
            popoverTarget={id}
            popoverTargetAction="hide"
            accentColor="ghost"
            className="translate-x-1/4"
          >
            <Icon name="XMarkIcon" />
            <span className="sr-only">Close Drawer</span>
          </Button>
        </div>
        {description && <Paragraph className="mb-8">{description}</Paragraph>}
        {children}
      </section>
    );
  },
);

Drawer.displayName = 'Drawer';
