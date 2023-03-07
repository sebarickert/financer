import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { TransactionCategoriesFormItem } from './transaction-categories-form.item';

import { Button } from '$elements/button/button';
import { Option } from '$elements/select/select';

interface TransactionCategoriesFormProps {
  className?: string;
  transactionCategories: Option[];
  testId?: string;
  categorySelectOnly?: boolean;
}

export interface TransactionCategoriesFormFields {
  description?: string;
  category_id: string;
  amount: number;
}

interface FieldArrayFields {
  categories: TransactionCategoriesFormFields[];
}

export const TransactionCategoriesForm = ({
  className = '',
  transactionCategories,
  testId = 'transaction-categories-form',
  categorySelectOnly,
}: TransactionCategoriesFormProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray<FieldArrayFields>({
    name: 'categories',
  });

  const { setValue } = useFormContext();

  const transactionAmount = useWatch({ name: 'amount' });

  const totalAllocatedAmount = fields
    .map(({ amount }) => amount || 0)
    .reduce((current, previous) => current + previous, 0);

  return (
    <>
      <div className={className} data-testid={testId}>
        {fields.map(({ id, amount = 0 }, index) => (
          <TransactionCategoriesFormItem
            index={index}
            categories={transactionCategories}
            namePrefix={`categories.${index}`}
            deleteTransactionCategoryItem={() => remove(index)}
            setUnallocatedAmount={() => {
              const unallocatedAmount =
                transactionAmount - totalAllocatedAmount + (amount || 0);
              setValue(`categories.${index}.amount`, unallocatedAmount);
            }}
            testId={testId}
            key={id}
            categorySelectOnly={categorySelectOnly}
            maxAmount={transactionAmount}
          />
        ))}
      </div>
      <Button
        onClick={() => append({} as TransactionCategoriesFormFields)}
        accentColor="plain"
        isDisabled={!transactionAmount || transactionAmount < 0}
        testId="add-category-button"
      >
        Add category item
      </Button>
    </>
  );
};
