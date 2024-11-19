import clsx from 'clsx';
import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
import { Input } from '$elements/Input';
import { Select, Option } from '$elements/Select';
import { formatCurrency } from '$utils/formatCurrency';

type TransactionCategoriesItemProps = {
  index: number;
  categories: Option[];
  setUnallocatedAmount(index: number): void;
  categoryId: string;
  amount: number;
  categorySelectOnly?: boolean;
};

export const TransactionCategoriesItem: FC<TransactionCategoriesItemProps> = ({
  index,
  categories,
  setUnallocatedAmount,
  categoryId,
  amount,
  categorySelectOnly,
}) => {
  const namePrefix = `categories.${index}` as const;
  const { setValue } = useFormContext();
  const categoryWatch: {
    description?: string;
    amount?: number;
    categoryId?: string;
  } = useWatch({ name: namePrefix });

  useEffect(() => {
    setValue(namePrefix, { categoryId, amount });
  }, [amount, categoryId, namePrefix, setValue]);

  const categoryLabel = categories.find(
    (category) => category.value === categoryWatch?.categoryId,
  )?.label;

  return (
    <details
      name="transaction-categories-item"
      className="group"
      data-testid="transaction-categories-item"
    >
      <summary
        className={clsx(
          'grid grid-cols-[auto,1fr,auto] gap-2',
          'p-3 h-12 rounded-md theme-layer-color-with-hover text-[--color-text-primary]',
          'hover:cursor-pointer theme-focus',
          'mr-[56px]',
          '[&::-webkit-details-marker]:hidden',
        )}
        data-testid="transaction-categories-item-summary"
      >
        <Icon
          name="ChevronRightIcon"
          className="group-open:rotate-90 shrink-0"
        />
        <span className="truncate" data-testid="category-label">
          {categoryLabel || '-'}
        </span>
        <span className="shrink-0" data-testid="amount">
          {formatCurrency(categoryWatch?.amount || 0)}
        </span>
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
          isLabelHidden
        >
          Category
        </Select>
        <Input
          id={`${namePrefix}.amount`}
          type="number"
          min={0.01}
          step={0.01}
          isRequired={!categorySelectOnly}
          isLabelHidden
        >
          Amount
        </Input>
        <Button
          accentColor="secondary"
          size="icon"
          onClick={() => setUnallocatedAmount(index)}
        >
          <Icon name={'PlusCircleIcon'} />
          <span className="sr-only">Remove</span>
        </Button>
        <div className="col-span-full">
          <Input id={`${namePrefix}.description`} isLabelHidden>
            Description
          </Input>
        </div>
      </div>
    </details>
  );
};
