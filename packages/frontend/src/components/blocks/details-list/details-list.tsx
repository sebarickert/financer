import clsx from 'clsx';
import { FC } from 'react';

import { DetailsItem, DetailsListItem } from './details-list.item';

import { Icon } from '$elements/icon/icon.new';

interface DetailsListProps {
  className?: string;
  items: DetailsItem[];
  testId?: string;
  heading?: string;
}

export const DetailsList: FC<DetailsListProps> = ({
  className = '',
  items,
  testId: rawTestId,
  heading,
}) => {
  const testId = rawTestId ?? 'details-list';

  return (
    <section className={clsx('grid gap-3', { [className]: true })}>
      {heading && (
        <h2 className="inline-flex items-center gap-2 font-normal text-black/75">
          <Icon name="InformationCircleIcon" />
          {heading}
        </h2>
      )}
      <dl className={clsx('grid gap-4')} data-testid={testId}>
        {items.map((item) => (
          <DetailsListItem
            key={item.label}
            testId={`${item.testId ?? testId}-item`}
            {...item}
          />
        ))}
      </dl>
    </section>
  );
};
