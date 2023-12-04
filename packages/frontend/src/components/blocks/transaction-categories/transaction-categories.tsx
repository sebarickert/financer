import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { TransactionCategoriesForm } from './transaction-categories.form';
import { TransactionCategoriesItem } from './transaction-categories.item';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { Option } from '$elements/select/select';

interface TransactionCategoriesProps {
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

export interface FieldArrayFields {
  categories: TransactionCategoriesFormFields[];
}

export const TransactionCategories = ({
  transactionCategories,
  testId = 'transaction-categories',
  categorySelectOnly,
}: TransactionCategoriesProps): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = useState(NaN);

  const { getValues, watch, setValue } = useFormContext<FieldArrayFields>();
  const {
    fields: rawFields,
    remove,
    update,
  } = useFieldArray<FieldArrayFields>({
    name: 'categories',
  });

  const transactionAmount = useWatch({ name: 'amount' });
  const watchFieldArray = watch('categories');

  const fields = rawFields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const isNewCategory = !fields[selectedIndex];

  const totalAllocatedAmount = fields
    .map(({ amount }) => amount || 0)
    .reduce((current, previous) => current + previous, 0);

  const addNewCategory = () => {
    setSelectedIndex(fields.length);
  };

  const isEmptyCategory = (index: number) =>
    isNaN(parseInt(`${getValues(`categories.${index}`).amount}`));

  const setUnallocatedAmount = () => {
    const unallocatedAmount =
      transactionAmount - totalAllocatedAmount + (0 || 0);
    setValue(`categories.${selectedIndex}.amount`, unallocatedAmount);
  };

  const onClose = () => {
    setSelectedIndex(NaN);
  };

  const handleDelete = () => {
    remove(selectedIndex);
    setSelectedIndex(NaN);
  };

  const handleSubmit = () => {
    // @todo: some kind of input error needed.
    if (isEmptyCategory(selectedIndex)) {
      return;
    }

    const values = getValues(`categories.${selectedIndex}`);
    update(selectedIndex, values);
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
          testId={testId}
          key={selectedIndex}
          index={selectedIndex}
          categories={transactionCategories}
          categorySelectOnly={categorySelectOnly}
          maxAmount={transactionAmount}
          isNewCategory={isNewCategory}
          setUnallocatedAmount={setUnallocatedAmount}
          handleCancel={onClose}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
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
