'use client';

import clsx from 'clsx';
import { memo, type JSX } from 'react';

import { Toast } from './Toast';

import { useAppSelector } from '$store';

interface ToastContainerProps {
  className?: string;
}

export const ToastContainer = memo(
  ({ className = '' }: ToastContainerProps): JSX.Element | null => {
    const { toastMessages } = useAppSelector((state) => state.notification);

    return (
      <ol
        aria-live="polite"
        className={clsx(
          'fixed w-full top-0 left-0 max-h-screen flex-col-reverse flex p-4 z-[100] gap-4',
          'sm:bottom-0 sm:right-0 sm:top-auto sm:left-auto sm:flex-col md:max-w-[500px]',
          className && toastMessages.length > 0,
        )}
        data-testid="toast-container"
      >
        {toastMessages.map((toast) => (
          <li key={toast.id}>
            <Toast {...toast} />
          </li>
        ))}
      </ol>
    );
  },
);

ToastContainer.displayName = 'ToastContainer';
