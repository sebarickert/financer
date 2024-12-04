import clsx from 'clsx';
import { X } from 'lucide-react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '$elements/Button/Button';
import { removeToastMessage } from '$reducer/notifications.reducer';

export enum ToastMessageTypes {
  ERROR,
  SUCCESS,
  GENERAL,
}

export type ToastMessage = {
  type: ToastMessageTypes;
  message: string;
  additionalInformation?: string | string[];
  action?: React.ReactNode;
  id?: string;
};

type ToastProps = ToastMessage & {
  className?: string;
};

export const Toast = ({
  className = '',
  additionalInformation,
  message,
  type,
  id,
  action,
}: ToastProps) => {
  const dispatch = useDispatch();

  const handleRemove = useCallback(() => {
    dispatch(removeToastMessage(id));
  }, [dispatch, id]);

  const toastStyles = clsx('ring-2', {
    ['ring-red']: type === ToastMessageTypes.ERROR,
    ['ring-accent']: type === ToastMessageTypes.GENERAL,
    ['ring-green']: type === ToastMessageTypes.SUCCESS,
  });

  const additionalInformationContent = Array.isArray(additionalInformation) ? (
    <ul className="pl-5 space-y-2 list-disc">
      {additionalInformation.map((information) => (
        <li key={information}>{information}</li>
      ))}
    </ul>
  ) : (
    <p className="">{additionalInformation}</p>
  );

  return (
    <div
      className={clsx(
        'bg-layer  rounded-md',
        'p-6 relative',
        'flex gap-4',
        toastStyles,
        className,
      )}
      role="status"
      data-testid="toast"
      data-toast-type={type}
    >
      <div className="grow">
        <p className="pr-10 font-medium">{message}</p>
        {additionalInformation && (
          <div className="max-w-lg mt-2 text-muted-foreground">
            {additionalInformation && additionalInformationContent}
          </div>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
      {id && (
        <Button
          onClick={handleRemove}
          testId="toast-remove"
          size="icon"
          accentColor="ghost"
          className={clsx('absolute', {
            ['-translate-y-1/2 right-2 top-1/2']: !additionalInformation,
            ['top-6 right-6 -translate-y-[12px] translate-x-[12px]']:
              additionalInformation,
          })}
        >
          <X />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  );
};
