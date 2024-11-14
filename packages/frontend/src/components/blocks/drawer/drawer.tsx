import clsx from 'clsx';
import { forwardRef } from 'react';

import { DrawerHeader } from './drawer.header';

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
      'backdrop:backdrop-blur-none backdrop:ease-in backdrop:transition-all backdrop:!transition-allow-discrete',
      'backdrop:open:backdrop-blur-sm backdrop:open:ease-out backdrop:open:transition-all backdrop:open:!transition-allow-discrete',
      'starting:open:backdrop-blur-none',
      // Drawer animation
      'max-lg:translate-y-full lg:translate-x-full !transition-allow-discrete transition-all duration-100',
      'open:max-lg:translate-y-0 open:ease-out open:lg:translate-x-0 open:!transition-allow-discrete open:transition-all open:duration-200',
      'starting:open:max-lg:translate-y-full starting:open:lg:translate-x-full',
      // Drawer
      'theme-bg-color theme-text-primary fixed text-left',
      'px-6 lg:px-8 pt-0 pb-[calc(env(safe-area-inset-bottom)+48px)]',
      'max-lg:inset-x-0 max-lg:top-auto max-lg:w-full max-lg:rounded-t-2xl',
      'lg:inset-y-0 lg:overflow-y-auto lg:max-w-[600px] lg:w-3/4 lg:left-auto lg:h-full',
      'bottom-0 m-0',
      'min-[1440px]:max-w-[552px] min-[1440px]:box-content min-[1440px]:pr-[100vw] min-[1440px]:mr-[-100vw] min-[1440px]:right-[calc(calc(100vw-1440px)/2+1.5rem)]',
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
        <DrawerHeader
          onClose={onClose}
          heading={heading}
          className={clsx(
            `sticky top-0 z-10 theme-bg-color`,
            'pt-8 pb-6 mb-2',
            'px-6 lg:px-8 -mx-6 lg:-mx-8',
          )}
          id={id}
        >
          {description}
        </DrawerHeader>
        {children}
      </section>
    );
  },
);

Drawer.displayName = 'Drawer';
