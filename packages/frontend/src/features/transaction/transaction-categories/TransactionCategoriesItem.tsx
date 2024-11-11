import clsx from 'clsx';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';

import { Button } from '$elements/button/button';
import { Icon } from '$elements/Icon';
import { Input } from '$elements/input/input';
import { Select, Option } from '$elements/select/select';
import { formatCurrency } from '$utils/formatCurrency';

type TransactionCategoriesItemProps = {
  index: number;
  categories: Option[];
  setUnallocatedAmount(index: number): void;
};

export const TransactionCategoriesItem: FC<TransactionCategoriesItemProps> = ({
  index,
  categories,
  setUnallocatedAmount,
}) => {
  const namePrefix = `categories.${index}` as const;
  const { categoryLabel, amount } = useWatch({ name: namePrefix });

  return (
    <details name="transaction-categories" className="group">
      <summary
        className={clsx(
          'grid grid-cols-[auto,1fr,auto] gap-2',
          'p-3 rounded-md theme-layer-color-with-hover',
          'hover:cursor-pointer theme-focus',
          'mr-[52px]',
        )}
      >
        <Icon
          name="ChevronRightIcon"
          className="group-open:rotate-90 shrink-0"
        />
        <span className="truncate">{categoryLabel || '-'}</span>
        <span className="shrink-0">{formatCurrency(amount || 0)}</span>
      </summary>
      <div
        className={clsx(
          'grid gap-2 items-center grid-cols-[1fr,.5fr,auto] mt-2',
        )}
      >
        <Select
          id={`${namePrefix}.categoryId`}
          options={categories}
          placeholder="Select category"
        >
          Category
        </Select>
        <Input
          id={`${namePrefix}.amount`}
          type="number"
          min={0.01}
          step={0.01}
          isRequired
        >
          Amount
        </Input>
        <Button
          accentColor="secondary"
          className={clsx(
            '!h-12 !w-11 !p-0 inline-flex justify-center items-center',
          )}
          onClick={() => setUnallocatedAmount(index)}
        >
          <Icon name={'PlusCircleIcon'} />
          <span className="sr-only">Remove</span>
        </Button>
        <div className="col-span-full">
          <Input id={`${namePrefix}.description`}>Description</Input>
        </div>
      </div>
    </details>
  );
};
