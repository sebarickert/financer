import { TransactionCategoryMappingDto } from '@local/types';
import React from 'react';

import { Option } from '../select/select';

import { TransactionCategoriesFormItem } from './transaction-categories-form.item';

interface TransactionCategoriesFormProps {
  className?: string;
  categoryAmount: { [key in number]: number };
  amountMaxValue: number;
  transactionCategories: Option[];
  transactionCategoryMapping: TransactionCategoryMappingDto[] | null;
  deleteTransactionCategoryItem(itemKey: number): void;
  setTransactionCategoryItemAmount(itemKey: number, itemValue: number): void;
  testId?: string;
}

export const TransactionCategoriesForm = ({
  className = '',
  categoryAmount,
  transactionCategories,
  amountMaxValue,
  transactionCategoryMapping,
  deleteTransactionCategoryItem,
  setTransactionCategoryItemAmount,
  testId = 'transaction-categories-form',
}: TransactionCategoriesFormProps): JSX.Element => {
  const totalAllocatedAmount = Object.values(categoryAmount)
    .filter((item) => !Number.isNaN(item))
    .reduce((current, previous) => current + previous, 0);

  return (
    <div className={className} data-testid={testId}>
      {Object.entries(categoryAmount).map(([index, value], arrayIndex) => (
        <TransactionCategoriesFormItem
          categoryAmountIndex={parseInt(index, 10)}
          amountMaxValue={amountMaxValue}
          arrayIndex={arrayIndex}
          categories={transactionCategories}
          categoryMapping={transactionCategoryMapping?.[arrayIndex]}
          deleteTransactionCategoryItem={() =>
            deleteTransactionCategoryItem(parseInt(index, 10))
          }
          setTransactionCategoryItemAmount={(newValue: number) =>
            setTransactionCategoryItemAmount(parseInt(index, 10), newValue)
          }
          amountValue={value}
          setUnallocatedAmount={() => {
            setTransactionCategoryItemAmount(
              parseInt(index, 10),
              amountMaxValue - totalAllocatedAmount + (value || 0)
            );
          }}
          testId={testId}
          key={index}
        />
      ))}
    </div>
  );
};
