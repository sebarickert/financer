import clsx from 'clsx';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { IconName, Icon } from '$elements/icon/icon.new';
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
    ['bg-red text-white']: type === ToastMessageTypes.ERROR,
    ['bg-charcoal text-white']: type === ToastMessageTypes.GENERAL,
    ['bg-green text-white']: type === ToastMessageTypes.SUCCESS,
  });

  const toastIcon = (toastType: ToastMessageTypes) => {
    switch (toastType) {
      case ToastMessageTypes.ERROR:
        return 'ExclamationTriangleIcon' as IconName;
      case ToastMessageTypes.GENERAL:
        return 'InformationCircleIcon' as IconName;
      case ToastMessageTypes.SUCCESS:
        return 'CheckIcon' as IconName;
    }
  };

  const handleRemove = useCallback(() => {
    dispatch(removeToastMessage(id));
  }, [dispatch, id]);

  const additionalInformationContent = Array.isArray(additionalInformation) ? (
    <ul className="col-[2] mt-2 list-disc pb-2 pl-5 text-[0.875rem]">
      {additionalInformation.map((information) => (
        <li key={information}>{information}</li>
      ))}
    </ul>
  ) : (
    <p className="col-[2] mt-2 pb-2 text-[0.875rem]">{additionalInformation}</p>
  );

  return (
    <div
      className={clsx(
        'grid grid-cols-[auto,1fr,auto] items-start gap-x-4 p-4 rounded-md',
        {
          [className]: true,
          [toastStyles]: true,
        },
      )}
      role="status"
      data-testid="toast-item"
      data-toast-type={type}
    >
      <Icon name={toastIcon(type)} className="w-6 h-6" />
      <p>{message}</p>
      {additionalInformation && additionalInformationContent}
      {id && (
        <button
          className="col-[3] row-span-full inline-flex items-center justify-center"
          onClick={handleRemove}
          data-testid="toast-remove"
        >
          <Icon name="PlusIcon" className="w-6 h-6 rotate-45 fill-current" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
};
