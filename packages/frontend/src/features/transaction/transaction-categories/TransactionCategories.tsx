import clsx from 'clsx';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { CategoriesFormFullFields } from './transaction-categories.types';
import { TransactionCategoriesItem } from './TransactionCategoriesItem';

import { Button } from '$elements/button/button';
import { Heading } from '$elements/Heading';
import { Icon } from '$elements/Icon';
import { Option, Select } from '$elements/select/select';

interface TransactionCategoriesProps {
  transactionCategories: Option[];
  testId?: string;
  categorySelectOnly?: boolean;
}

export interface FieldArrayFields {
  categories: CategoriesFormFullFields[];
}

export const TransactionCategories = ({
  transactionCategories,
  categorySelectOnly,
}: TransactionCategoriesProps): JSX.Element => {
  const { setValue } = useFormContext<FieldArrayFields>();
  const { fields, remove, append } = useFieldArray<FieldArrayFields>({
    name: 'categories',
  });

  const transactionAmount = useWatch({ name: 'amount' });

  const totalAllocatedAmount = fields
    .map(({ amount }) => amount || 0)
    .reduce((current, previous) => current + previous, 0);

  const setUnallocatedAmount = (index: number) => {
    const unallocatedAmount =
      transactionAmount - totalAllocatedAmount + (0 || 0);
    setValue(`categories.${index}.amount`, unallocatedAmount);
  };

  return (
    <>
      <Heading disableResponsiveSizing>Categories</Heading>
      {fields.length === 0 && (
        <Select
          id={`${'123'}.categoryId`}
          options={transactionCategories}
          placeholder="Select category"
          isDisabled={!transactionAmount || transactionAmount < 0}
          handleOnChange={(event) => {
            const categoryId = event.target.value;
            const categoryLabel =
              event.target.options[event.target.selectedIndex].text;

            append({ categoryId, amount: transactionAmount, categoryLabel });
          }}
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
            />
            <Button
              accentColor="secondary"
              className={clsx(
                '!h-12 !w-11 !p-0 inline-flex justify-center items-center',
                'absolute right-0 top-0',
              )}
              onClick={() => remove(index)}
            >
              <Icon name={'XMarkIcon'} />
              <span className="sr-only">Remove</span>
            </Button>
          </li>
        ))}
      </ul>
      {fields.length > 0 && (
        <button
          type="button"
          className={clsx(
            'theme-focus w-full text-left',
            'grid grid-cols-[1fr,auto] gap-2 items-center',
            'hover:theme-text-secondary',
            { 'border-t theme-border-primary mt-4 pt-2': !!fields.length },
          )}
          onClick={() =>
            append({ categoryId: '', amount: NaN, categoryLabel: '' })
          }
        >
          <p className="pl-2">Add Category</p>
          <span
            className={clsx(
              '!h-11 !w-11 !p-0 inline-flex justify-center items-center theme-button-secondary rounded-md',
            )}
          >
            <Icon name={'PlusIcon'} />
          </span>
        </button>
      )}
    </>
  );
};
