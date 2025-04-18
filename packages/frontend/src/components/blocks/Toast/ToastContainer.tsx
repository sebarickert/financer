'use client';

import clsx from 'clsx';
import { type JSX, memo } from 'react';

import { Toast } from './Toast';

import { useAppSelector } from '@/store';

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
          'fixed w-full top-(--gutter-top) left-0 max-h-screen flex-col-reverse flex p-4 gap-4 z-10',
          'sm:bottom-0 sm:right-0 sm:top-auto sm:left-auto sm:flex-col md:max-w-[500px]',
          { 'pointer-events-none': toastMessages.length === 0 },
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
