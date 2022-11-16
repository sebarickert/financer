import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { NotificationClose } from './notification.close';
import { NotificationContent } from './notification.content';
import { NotificationIcon } from './notification.icon';

export interface NotificationProps {
  type: 'success' | 'error';
  label: string;
  children: string;
  resetNotification?(): void;
  className?: string;
}

export const Notification = ({
  type,
  label,
  children,
  resetNotification = () => {},
  className = '',
}: NotificationProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!type || !label || !children) return;
    setIsOpen(true);
  }, [type, label, children]);

  const handleClose = () => {
    resetNotification();
    setIsOpen(false);
  };

  return (
    <section
      className={clsx(
        'fixed bottom-[calc(78px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-full max-w-sm overflow-hidden bg-charcoal rounded-md p-4 text-white z-20',
        {
          ['inline-block']: isOpen,
          ['hidden']: !isOpen,
          [className]: true,
        }
      )}
      role="status"
    >
      <div className="grid-cols-[auto,1fr,auto] grid gap-4 items-start">
        <NotificationIcon type={type} />
        <NotificationContent label={label}>{children}</NotificationContent>
        <NotificationClose onClick={handleClose} />
      </div>
    </section>
  );
};
