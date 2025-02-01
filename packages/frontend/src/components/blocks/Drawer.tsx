import clsx from 'clsx';
import { X } from 'lucide-react';
import { forwardRef } from 'react';

import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
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
      'backdrop:ease-in-out backdrop:duration-200',
      'backdrop:bg-black/0',
      'open:starting:backdrop:bg-black/0',
      'open:backdrop:bg-black/80 dark:open:backdrop:bg-black/90',
      // Drawer animation
      // NOTE: `transition-discrete` causes crashes in Chromium-based browsers when used for closing.
      // Re-enable for closing when the issue is resolved.
      // 'ease-in-out duration-200 transition-discrete',
      'ease-in-out duration-200 open:transition-discrete',
      'max-lg:translate-y-full lg:translate-x-full',
      'max-lg:open:starting:translate-y-full lg:open:starting:translate-x-full',
      'max-lg:open:translate-y-0 lg:open:translate-x-0',
      // Drawer
      'bg-background text-foreground fixed text-left',
      'max-lg:bottom-0 max-lg:inset-x-0 max-lg:top-auto max-lg:w-full max-lg:rounded-t-[10px]',
      'lg:max-w-[600px] lg:w-full lg:left-auto lg:h-full',
      'pt-0 pb-safe-offset-12 px-6 lg:px-8',
      'max-lg:border lg:border-l',
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
            'bg-background z-10',
            'sticky top-0',
            'pt-2 pb-2 mb-8',
            'px-6 lg:px-8 -mx-6 lg:-mx-8',
            'border-b',
          )}
        >
          <Heading noMargin>{heading}</Heading>
          <Button
            size="icon"
            onClick={onClose}
            haptic="light"
            popoverTarget={id}
            popoverTargetAction="hide"
            accentColor="ghost"
            className="translate-x-1/4"
          >
            <X />
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
