import clsx from 'clsx';
import { FC } from 'react';

type FieldGroupProps = {
  children: React.ReactNode;
};

/* This component is used to group a field and its icon together */
export const FieldGroup: FC<FieldGroupProps> = ({ children }) => {
  return (
    <div
      className={clsx(
        'grid grid-cols-[theme(spacing.12),1fr] isolate',
        '[&>[data-slot="icon"]]:z-10 [&>[data-slot="icon"]]:row-start-1 [&>[data-slot="icon"]]:col-start-1 [&>[data-slot="icon"]]:place-self-center [&>[data-slot="icon"]]:text-muted-foreground',
        '[&>[data-slot="control"]]:col-span-2 [&>[data-slot="control"]]:row-start-1 [&>[data-slot="control"]]:col-start-1',
        '[&>[data-slot="icon"]+[data-slot="control"]]:pl-12',
        '[&>[data-slot="icon"]+[data-slot="control"]>[data-slot="custom-select-button"]]:pl-0',
      )}
    >
      {children}
    </div>
  );
};
