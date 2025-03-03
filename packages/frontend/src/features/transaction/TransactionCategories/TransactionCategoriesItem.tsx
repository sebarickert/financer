import clsx from 'clsx';
import { Calculator, ChevronRight } from 'lucide-react';
import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/elements/Button/Button';
import { Input } from '@/elements/Input';
import { Option, Select } from '@/elements/Select';
import { formatCurrency } from '@/utils/formatCurrency';

interface TransactionCategoriesItemProps {
  index: number;
  categories: Option[];
  setUnallocatedAmount: (index: number) => void;
  categoryId: string;
  amount: number;
  categorySelectOnly?: boolean;
}

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const categoryWatch: {
    description?: string;
    amount?: number;
    categoryId?: string;
  } = useWatch({ name: namePrefix });

  useEffect(() => {
    setValue(namePrefix, { categoryId, amount });
  }, [amount, categoryId, namePrefix, setValue]);

  const categoryLabel = categories.find(
    (category) => category.value === categoryWatch.categoryId,
  )?.label;

  return (
    <details
      name="transaction-categories-item"
      className="group"
      data-testid="transaction-categories-item"
    >
      <summary
        className={clsx(
          'grid grid-cols-[auto_1fr_auto] gap-2',
          'p-3 h-12 rounded-md bg-layer hover:bg-accent active:bg-accent text-foreground',
          'hover:cursor-pointer focus-visible:focus-highlight',
          'mr-[56px]',
          '[&::-webkit-details-marker]:hidden',
        )}
        data-testid="transaction-categories-item-summary"
      >
        <ChevronRight className="group-open:rotate-90 shrink-0" />
        <span className="truncate" data-testid="category-label">
          {categoryLabel ?? '-'}
        </span>
        <span className="shrink-0" data-testid="amount">
          {formatCurrency(categoryWatch.amount ?? 0)}
        </span>
      </summary>
      <div
        className={clsx(
          'grid gap-2 items-center grid-cols-[1fr_.5fr_auto] mt-2',
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
          onClick={() => {
            setUnallocatedAmount(index);
          }}
        >
          <Calculator />
          <span className="sr-only">Set Unallocated Amount</span>
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
