import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import Container from "../container/container";
import NotificationClose from "./notification.close";
import NotificationContent from "./notification.content";
import NotificationIcon from "./notification.icon";

export interface INotificationProps {
  type: "success" | "error";
  label: string;
  children: string;
}

const Notification = ({
  type,
  label,
  children,
}: INotificationProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Container className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
      <Transition
        show={isOpen}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {(ref) => (
          <div
            className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
            ref={ref}
            role="status"
          >
            <div className="p-4">
              <div className="flex items-start">
                <NotificationIcon type={type} />
                <NotificationContent label={label}>
                  {children}
                </NotificationContent>
                <NotificationClose onClick={() => setIsOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Container>
  );
};

export default Notification;
