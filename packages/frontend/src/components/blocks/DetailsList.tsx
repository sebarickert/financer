import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

export type DetailsItem = {
  Icon?: LucideIcon;
  label: string;
  description: string | React.ReactNode;
  testId?: string;
};

type DetailsListProps = {
  className?: string;
  items: DetailsItem[];
  testId?: string;
  heading?: string;
};

export const DetailsList: FC<DetailsListProps> = ({
  className,
  items,
  testId: rawTestId,
  heading,
}) => {
  const testId = rawTestId ?? 'details-list';

  return (
    <div className={clsx('grid gap-3 ', className)}>
      {heading && <h2 className="font-medium">{heading}</h2>}
      <dl className={clsx('grid gap-4')} data-testid={testId}>
        {items.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[auto_1fr] gap-2 items-center"
            data-testid={`${item.testId ?? testId}-item`}
          >
            <dt className="inline-flex items-center gap-2">
              {item.Icon && <item.Icon />}
              <span data-testid={`${testId}-item-label`}>{item.label}</span>
            </dt>
            <dd className="font-medium text-right truncate">
              <span data-testid={`${testId}-item-description`}>
                {item.description}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
