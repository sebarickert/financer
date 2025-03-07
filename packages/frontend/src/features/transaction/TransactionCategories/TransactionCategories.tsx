import clsx from 'clsx';
import { Plus, Tag, X } from 'lucide-react';
import { type JSX, useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { CategoriesFormFullFields } from './transaction-categories.types';
import { TransactionCategoriesItem } from './TransactionCategoriesItem';

import { Button } from '@/elements/Button/Button';
import { Heading } from '@/elements/Heading';
import { Option, Select } from '@/elements/Select';

interface TransactionCategoriesProps {
  transactionCategories: Option[];
  categorySelectOnly?: boolean;
}

export interface FieldArrayFields {
  setFirstCategorySelect: string;
  categories: CategoriesFormFullFields[];
}

export const TransactionCategories = ({
  transactionCategories,
  categorySelectOnly,
}: TransactionCategoriesProps): JSX.Element => {
  const { setValue, resetField } = useFormContext<FieldArrayFields>();
  const { fields, remove, append } = useFieldArray<FieldArrayFields>({
    name: 'categories',
  });

  const transactionAmount = useWatch({ name: 'amount' }) as number;

  const totalAllocatedAmount = fields
    .map(({ amount }) => amount || 0)
    .reduce((current, previous) => current + previous, 0);

  const setUnallocatedAmount = (index: number) => {
    const unallocatedAmount = transactionAmount - totalAllocatedAmount;
    setValue(`categories.${index}.amount`, unallocatedAmount);
  };

  useEffect(() => {
    resetField('setFirstCategorySelect');
  }, [fields, resetField]);

  const isSelectDisabled =
    !categorySelectOnly && (!transactionAmount || transactionAmount < 0);
  return (
    <>
      <Heading className="sr-only">Categories</Heading>
      {fields.length === 0 && (
        <Select
          id={`setFirstCategorySelect`}
          options={transactionCategories}
          placeholder="Select category"
          isLabelHidden
          isDisabled={isSelectDisabled}
          isBleedingEdge={false}
          Icon={Tag}
          handleOnChange={(event) => {
            const categoryId = event.target.value;

            append({ categoryId, amount: transactionAmount, description: '' });
          }}
          testId="select-first-category"
        >
          Category
        </Select>
      )}
      <ul className="grid gap-2">
        {fields.map((category, index) => (
          <li key={category.id} className="relative">
            <TransactionCategoriesItem
              categories={transactionCategories}
              index={index}
              setUnallocatedAmount={setUnallocatedAmount}
              amount={category.amount}
              categoryId={category.categoryId}
              categorySelectOnly={categorySelectOnly}
            />
            <Button
              accentColor="secondary"
              className={clsx('absolute right-0 top-0')}
              size="icon"
              onClick={() => {
                remove(index);
              }}
              testId="remove-category"
            >
              <X />
              <span className="sr-only">Remove</span>
            </Button>
          </li>
        ))}
      </ul>
      {fields.length > 0 && (
        <button
          data-testid="add-category"
          type="button"
          className={clsx(
            'focus-visible:focus-highlight w-full text-left',
            'grid grid-cols-[1fr_auto] gap-2 items-center',
            'text-foreground hover:text-muted-foreground active:text-muted-foreground',
            {
              'border-t  mt-4 pt-2': Boolean(fields.length),
            },
          )}
          onClick={() => {
            append({ categoryId: '', amount: NaN, description: '' });
          }}
        >
          <p className="pl-2">Add Category</p>
          <span
            className={clsx(
              '!h-12 !w-12 !p-0 inline-flex justify-center items-center button-secondary rounded-md',
            )}
          >
            <Plus />
          </span>
        </button>
      )}
    </>
  );
};
