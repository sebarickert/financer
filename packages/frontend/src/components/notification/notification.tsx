import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';

import { isIOSDevice } from '../../utils/isIOSDevice';
import { isStandaloneMode } from '../../utils/isStandaloneMode';
import { Container } from '../container/container';

import { NotificationClose } from './notification.close';
import { NotificationContent } from './notification.content';
import { NotificationIcon } from './notification.icon';

export interface INotificationProps {
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
}: INotificationProps): JSX.Element => {
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
      className={`fixed inset-0 flex items-end justify-center px-4 pt-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-20 ${
        isIOSDevice() && isStandaloneMode() ? 'pb-28' : 'pb-20'
      } ${className}`}
    >
      <Transition
        show={isOpen}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        role="status"
      >
        <div className="p-4">
          <div className="flex items-start">
            <NotificationIcon type={type} />
            <NotificationContent label={label}>{children}</NotificationContent>
            <NotificationClose onClick={handleClose} />
          </div>
        </div>
      </Transition>
    </Container>
  );
};
