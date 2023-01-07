import { TransactionCategoriesFormItem } from './transaction-categories-form.item';

import { TransactionCategoryMappingDto } from '$api/generated/financerApi';
import { Option } from '$elements/select/select';

interface TransactionCategoriesFormProps {
  className?: string;
  categoryAmount: { [key in number]: number };
  amountMaxValue: number;
  transactionCategories: Option[];
  transactionCategoryMapping: TransactionCategoryMappingDto[] | null;
  deleteTransactionCategoryItem(itemKey: number): void;
  setTransactionCategoryItemAmount(itemKey: number, itemValue: number): void;
  testId?: string;
  categorySelectOnly?: boolean;
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
  categorySelectOnly,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          categoryMapping={transactionCategoryMapping?.[arrayIndex] as any}
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
          categorySelectOnly={categorySelectOnly}
        />
      ))}
    </div>
  );
};
