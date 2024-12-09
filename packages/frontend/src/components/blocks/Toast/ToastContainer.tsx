'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { Toast } from './Toast';

import { useAppSelector } from '$store';

interface ToastContainerProps {
  className?: string;
}

export const ToastContainer = memo(
  ({ className = '' }: ToastContainerProps): JSX.Element | null => {
    const { toastMessages } = useAppSelector((state) => state.notification);

    return (
      <ul
        aria-live="polite"
        className={clsx('space-y-4', { [className]: toastMessages.length > 0 })}
        data-testid="toast-container"
      >
        {toastMessages.map((toast) => (
          <li key={toast.id}>
            <Toast {...toast} />
          </li>
        ))}
      </ul>
    );
  },
);

ToastContainer.displayName = 'ToastContainer';
