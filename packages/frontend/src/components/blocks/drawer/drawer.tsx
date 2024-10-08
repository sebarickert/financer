import clsx from 'clsx';

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

export const Drawer = ({
  className = '',
  onClose,
  children,
  testId,
  id,
  heading,
  description,
}: DrawerProps) => {
  const drawerBaseClasses = clsx('', {
    [className]: true,
    ['drawer backdrop']: true,
    ['bg-white fixed text-left']: true,
    ['px-8 pt-8 pb-[calc(env(safe-area-inset-bottom)+48px)]']: true,
    ['max-lg:inset-x-0 max-lg:top-auto max-lg:w-full max-lg:rounded-t-2xl']:
      true,
    ['lg:inset-y-0 lg:overflow-y-auto lg:max-w-[600px] lg:w-3/4 lg:left-auto lg:h-full']:
      true,
    ['bottom-0 m-0']: true,
    ['min-[1440px]:max-w-[552px] min-[1440px]:box-content min-[1440px]:pr-[100vw] min-[1440px]:mr-[-100vw] min-[1440px]:right-[calc(calc(100vw-1440px)/2+1.5rem)]']:
      true,
  });

  return (
    <section
      className={drawerBaseClasses}
      popover="auto"
      id={id}
      data-testid={testId ?? 'drawer'}
    >
      <DrawerHeader
        onClose={onClose}
        heading={heading}
        className="mb-8"
        id={id}
      >
        {description}
      </DrawerHeader>
      {children}
    </section>
  );
};
