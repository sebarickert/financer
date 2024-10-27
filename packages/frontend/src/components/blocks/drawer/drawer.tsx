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
    const drawerBaseClasses = clsx('', className, {
      ['drawer backdrop']: true,
      ['theme-bg-color theme-text-primary fixed text-left']: true,
      ['px-6 lg:px-8 pt-0 pb-[calc(env(safe-area-inset-bottom)+48px)]']: true,
      ['max-lg:inset-x-0 max-lg:top-auto max-lg:w-full max-lg:rounded-t-2xl']:
        true,
      ['lg:inset-y-0 lg:overflow-y-auto lg:max-w-[600px] lg:w-3/4 lg:left-auto lg:h-full']:
        true,
      ['bottom-0 m-0']: true,
      ['min-[1440px]:max-w-[552px] min-[1440px]:box-content min-[1440px]:pr-[100vw] min-[1440px]:mr-[-100vw] min-[1440px]:right-[calc(calc(100vw-1440px)/2+1.5rem)]']:
        true,
      ['max-h-dvh']: true,
    });

    return (
      <section
        className={drawerBaseClasses}
        popover="auto"
        id={id}
        data-testid={testId ?? 'drawer'}
        ref={ref}
      >
        <DrawerHeader
          onClose={onClose}
          heading={heading}
          className="sticky top-0 z-10 pt-8 pb-8 theme-bg-color"
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
