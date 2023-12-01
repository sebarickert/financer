import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import {
  TransactionCategoriesProps,
  FieldArrayFields,
  TransactionCategoriesFormFields,
} from './transaction-categories';
import { TransactionCategoriesForm } from './transaction-categories.form';
import { TransactionCategoriesItem } from './transaction-categories.item';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';

export const TransactionCategories = ({
  transactionCategories,
  testId = 'transaction-categories',
  categorySelectOnly,
}: TransactionCategoriesProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray<FieldArrayFields>({
    name: 'categories',
  });
  const { getValues } = useFormContext<FieldArrayFields>();
  const [selectedIndex, setSelectedIndex] = useState(NaN);

  const { setValue } = useFormContext();

  const transactionAmount = useWatch({ name: 'amount' });
  const isNewCategory = !fields[selectedIndex]?.category_id;

  const totalAllocatedAmount = fields
    .map(({ amount }) => amount || 0)
    .reduce((current, previous) => current + previous, 0);

  const addNewCategory = () => {
    append({} as TransactionCategoriesFormFields);
    setSelectedIndex(fields.length);
  };

  const isEmptyCategory = (index: number) =>
    isNaN(parseInt(`${getValues(`categories.${index}`).amount}`));

  const onClose = () => {
    if (isEmptyCategory(selectedIndex)) {
      remove(selectedIndex);
    }
    setSelectedIndex(NaN);
  };

  return (
    <>
      <Button
        onClick={addNewCategory}
        accentColor="plain"
        isDisabled={!transactionAmount || transactionAmount < 0}
        testId="add-category-button"
      >
        Add category
      </Button>
      <Drawer
        isOpen={!isNaN(selectedIndex)}
        onClose={onClose}
        heading={!isNewCategory ? 'Edit category item' : 'Add category item'}
      >
        <TransactionCategoriesForm
          key={selectedIndex}
          index={selectedIndex}
          categories={transactionCategories}
          deleteTransactionCategoryItem={() => remove(selectedIndex)}
          setUnallocatedAmount={() => {
            const unallocatedAmount =
              transactionAmount - totalAllocatedAmount + (0 || 0);
            setValue(`categories.${selectedIndex}.amount`, unallocatedAmount);
          }}
          testId={testId}
          categorySelectOnly={categorySelectOnly}
          maxAmount={transactionAmount}
          remove={remove}
          onClose={onClose}
        />
      </Drawer>
      <ul className="mt-4 divide-y divide-gray-dark">
        {fields.map(({ id }, index) => (
          <TransactionCategoriesItem
            key={id}
            index={index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </ul>
    </>
  );
};
