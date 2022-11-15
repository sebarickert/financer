import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { Container } from '../../layouts/container/container';

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
    <Container
      className={clsx(
        'fixed inset-0 flex items-end justify-center px-4 pt-6 lg:p-6 lg:items-start lg:justify-end z-20 pb-[calc(78px+env(safe-area-inset-bottom))]',
        { [className]: true }
      )}
    >
      <section
        className={clsx(
          'w-full max-w-sm overflow-hidden bg-charcoal rounded-md p-4 text-white relative',
          {
            ['inline-block']: isOpen,
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
    </Container>
  );
};
