import { useCallback, useId, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { TransactionCategoriesForm } from './transaction-categories.form';
import { TransactionCategoriesItem } from './transaction-categories.item';
import { CategoriesFormFullFields } from './transaction-categories.types';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { Option } from '$elements/select/select';
import { useGetAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useGetAllTransactionCategoriesWithCategoryTree';

interface TransactionCategoriesProps {
  transactionCategories: Option[];
  testId?: string;
  categorySelectOnly?: boolean;
}

export interface FieldArrayFields {
  categories: CategoriesFormFullFields[];
}

const defaultSelectedIndex = -1;

export const TransactionCategories = ({
  transactionCategories,
  testId = 'transaction-categories',
  categorySelectOnly,
}: TransactionCategoriesProps): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const formId = useId();

  const { data: transactionCategoriesRaw } =
    useGetAllTransactionCategoriesWithCategoryTree();

  const getCategoryNameById = useCallback(
    (categoryId: string) =>
      transactionCategoriesRaw?.find((category) => category.id === categoryId)
        ?.categoryTree || categoryId,
    [transactionCategoriesRaw],
  );

  const { getValues, setValue } = useFormContext<FieldArrayFields>();

  const { fields, remove, update } = useFieldArray<FieldArrayFields>({
    name: 'categories',
  });

  const transactionAmount = useWatch({ name: 'amount' });

  const isNewCategory = !fields[selectedIndex];

  const totalAllocatedAmount = fields
    .map(({ amount }) => amount || 0)
    .reduce((current, previous) => current + previous, 0);

  const addNewCategory = () => {
    setSelectedIndex(fields.length);
  };

  const isEmptyCategory = (index: number) =>
    isNaN(parseFloat(`${getValues(`categories.${index}`).amount}`));

  const setUnallocatedAmount = () => {
    const unallocatedAmount =
      transactionAmount - totalAllocatedAmount + (0 || 0);
    setValue(`categories.${selectedIndex}.amount`, unallocatedAmount);
  };

  const onClose = () => {
    if (isNewCategory) {
      remove(selectedIndex);
    }

    setSelectedIndex(defaultSelectedIndex);
  };

  const handleDelete = async () => {
    setTimeout(() => {
      remove(selectedIndex);
    }, 100);
  };

  const handleSubmit = () => {
    // @todo: some kind of input error needed.
    if (isEmptyCategory(selectedIndex) && !categorySelectOnly) {
      return;
    }

    const values = getValues(`categories.${selectedIndex}`);
    update(selectedIndex, values);
  };

  const handleCategoryItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <Button
        onClick={addNewCategory}
        accentColor="plain"
        isDisabled={!transactionAmount || transactionAmount < 0}
        testId="add-category-button"
        popoverTarget={formId}
        size="small"
      >
        Add category
      </Button>
      <Drawer
        id={formId}
        onClose={onClose}
        heading={!isNewCategory ? 'Edit category item' : 'Add category item'}
      >
        <TransactionCategoriesForm
          testId={testId}
          index={selectedIndex}
          categories={transactionCategories}
          categorySelectOnly={categorySelectOnly}
          maxAmount={transactionAmount}
          isNewCategory={isNewCategory}
          setUnallocatedAmount={setUnallocatedAmount}
          handleCancel={onClose}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          formId={formId}
        />
      </Drawer>
      {!!fields.length && (
        <ul className="mt-4 divide-y divide-gray-dark">
          {fields.map(({ id }, index) => (
            <TransactionCategoriesItem
              key={id}
              index={index}
              categorySelectOnly={categorySelectOnly}
              onClick={() => handleCategoryItemClick(index)}
              getCategoryNameById={getCategoryNameById}
              formId={formId}
            />
          ))}
        </ul>
      )}
    </>
  );
};
