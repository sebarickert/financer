import clsx from 'clsx';
import { FC } from 'react';

interface FieldGroupProps {
  children: React.ReactNode;
}

/* This component is used to group a field and its icon together */
export const FieldGroup: FC<FieldGroupProps> = ({ children }) => {
  return (
    <div
      className={clsx(
        'grid grid-cols-[calc(var(--spacing)*12)_1fr] isolate',
        '[&>svg]:z-10 [&>svg]:row-start-1 [&>svg]:col-start-1 [&>svg]:place-self-center [&>svg]:text-muted-foreground',
        '[&>[data-slot="control"]]:col-span-2 [&>[data-slot="control"]]:row-start-1 [&>[data-slot="control"]]:col-start-1',
        '[&>svg+[data-slot="control"]]:pl-12',
        '[&>svg+[data-slot="control"]>[data-slot="custom-select-button"]]:pl-0',
      )}
    >
      {children}
    </div>
  );
};
