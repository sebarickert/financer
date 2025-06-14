import clsx from 'clsx';
import { X } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/elements/Button/Button';
import { Heading } from '@/elements/Heading';

interface DrawerProps {
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
  testId?: string;
  id: string;
  heading?: string;
  description?: string;
  ref?: React.RefObject<HTMLDialogElement | null>;
}

export const Drawer: FC<DrawerProps> = ({
  className = '',
  onClose,
  children,
  testId,
  id,
  heading,
  description,
  ref,
}) => {
  const drawerBaseClasses = clsx(
    // Base styles to reset default dialog styles
    'fixed inset-0 h-auto max-h-none w-auto max-w-none border-none bg-transparent',

    // We need same duration for dialog root to keep it in DOM
    'group transition-discrete duration-300',

    // Drawer backdrop
    //
    // Animate out duration
    'backdrop:duration-100 backdrop:ease-in',
    // Animate in duration
    'open:backdrop:duration-300 open:starting:backdrop:ease-out',
    // Starting styles
    'backdrop:bg-black backdrop:backdrop-blur-none backdrop:opacity-0',
    'open:starting:backdrop:opacity-0 open:starting:backdrop:backdrop-blur-none',
    // Open styles
    'open:backdrop:opacity-70 open:backdrop:backdrop-blur-xs',
  );

  const drawerContentBaseClasses = clsx(
    'transition-discrete',
    // Animate out duration
    'ease-in duration-200',
    // Animate in duration
    'group-open:duration-300 group-open:starting:ease-out',

    // Starting styles
    // Mobile
    'max-lg:translate-y-full max-lg:group-open:starting:translate-y-full',
    // Desktop
    'lg:translate-x-full lg:group-open:starting:translate-x-full',

    // Open styles
    'bg-background text-foreground fixed text-left',
    'max-lg:bottom-0 max-lg:inset-x-0 max-lg:top-auto max-lg:w-full max-lg:rounded-t-[10px] max-lg:border max-lg:group-open:translate-y-0',
    'lg:max-w-[600px] lg:w-full lg:left-auto lg:right-0 lg:h-full lg:group-open:translate-x-0 lg:border-l',
    'pt-0 pb-safe-offset-12 px-6 lg:px-8',
    'max-h-dvh',
    className,
  );

  return (
    <dialog
      className={drawerBaseClasses}
      onClose={onClose}
      id={id}
      data-testid={testId ?? 'drawer'}
      ref={ref}
      data-body-scroll-lock="on"
      data-body-no-pointer-events="on"
    >
      <button
        className="fixed inset-0 -z-10 border-none bg-transparent"
        type="button"
        tabIndex={-1}
        aria-hidden={true}
        command="close"
        commandfor={id}
      />

      <div
        className={clsx('overflow-auto', drawerContentBaseClasses)}
        data-testid="drawer-content"
      >
        <div
          className={clsx(
            'flex justify-between items-center',
            'bg-background',
            'sticky top-0 z-10',
            'pt-2 pb-2 mb-8',
            'px-6 lg:px-8 -mx-6 lg:-mx-8',
            'border-b',
          )}
        >
          <Heading noMargin>{heading}</Heading>
          <Button
            size="icon"
            haptic="light"
            commandFor={id}
            command="close"
            accentColor="ghost"
            className="translate-x-1/4"
          >
            <X />
            <span className="sr-only">Close Drawer</span>
          </Button>
        </div>
        <div className="isolate">
          {description && <p className="mb-8">{description}</p>}
          {children}
        </div>
      </div>
    </dialog>
  );
};

Drawer.displayName = 'Drawer';
