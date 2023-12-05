import clsx from 'clsx';

import { DetailsItem, DetailsListItem } from './details-list.item';

interface DetailsListProps {
  className?: string;
  items: DetailsItem[];
}

export const DetailsList = ({ className = '', items }: DetailsListProps) => {
  return (
    <dl className={clsx('grid gap-4', { [className]: true })}>
      {items.map((item) => (
        <DetailsListItem key={item.label} {...item} />
      ))}
    </dl>
  );
};
