import clsx from 'clsx';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '$elements/Button/Button';
import { IconName, Icon } from '$elements/Icon';
import { removeToastMessage } from '$reducer/notifications.reducer';

export enum ToastMessageTypes {
  ERROR,
  SUCCESS,
  GENERAL,
}

export interface ToastMessage {
  type: ToastMessageTypes;
  message: string;
  additionalInformation?: string | string[];
  id?: string;
}

interface ToastProps extends ToastMessage {
  className?: string;
}

export const Toast = ({
  className = '',
  additionalInformation,
  message,
  type,
  id,
}: ToastProps) => {
  const dispatch = useDispatch();

  const toastStyles = clsx({
    ['bg-red-600/25']: type === ToastMessageTypes.ERROR,
    ['bg-gray-600/25']: type === ToastMessageTypes.GENERAL,
    ['bg-green-600/25']: type === ToastMessageTypes.SUCCESS,
  });

  const toastIcon = (toastType: ToastMessageTypes) => {
    switch (toastType) {
      case ToastMessageTypes.ERROR:
        return 'ExclamationTriangleIcon' as IconName;
      case ToastMessageTypes.GENERAL:
        return 'BellIcon' as IconName;
      case ToastMessageTypes.SUCCESS:
        return 'CheckIcon' as IconName;
    }
  };

  const handleRemove = useCallback(() => {
    dispatch(removeToastMessage(id));
  }, [dispatch, id]);

  const additionalInformationContent = Array.isArray(additionalInformation) ? (
    <ul className="pb-2 pl-5 mt-2 list-disc">
      {additionalInformation.map((information) => (
        <li key={information}>{information}</li>
      ))}
    </ul>
  ) : (
    <p className="pb-2 mt-2">{additionalInformation}</p>
  );

  return (
    <div
      className={clsx(
        'theme-layer-color theme-text-primary',
        'grid grid-cols-[auto,1fr,auto] items-start gap-x-4 py-5 px-4 rounded-md',
        className,
      )}
      role="status"
      data-testid="toast-item"
      data-toast-type={type}
    >
      <div
        className={clsx(
          'rounded-xl h-11 w-11',
          'inline-flex items-center justify-center shrink-0',
          toastStyles,
        )}
      >
        <Icon name={toastIcon(type)} />
      </div>
      <div className="mt-2.5">
        <p>{message}</p>
        {additionalInformation && additionalInformationContent}
      </div>
      {id && (
        <Button
          onClick={handleRemove}
          testId="toast-remove"
          size="icon"
          accentColor="secondary"
          className="col-[3] row-span-full"
        >
          <Icon name="XMarkIcon" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  );
};
