import clsx from 'clsx';

import { DetailsItem, DetailsListItem } from './details-list.item';

interface DetailsListProps {
  className?: string;
  items: DetailsItem[];
  testId?: string;
}

export const DetailsList = ({
  className = '',
  items,
  testId,
}: DetailsListProps) => {
  return (
    <dl
      className={clsx('grid gap-4', { [className]: true })}
      data-testid={testId}
    >
      {items.map((item) => (
        <DetailsListItem key={item.label} {...item} />
      ))}
    </dl>
  );
};
