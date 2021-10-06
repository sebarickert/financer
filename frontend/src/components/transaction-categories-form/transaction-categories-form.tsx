import React from "react";
import { IOption } from "../select/select";
import TransactionCategoriesFormItem from "./transaction-categories-form.item";

interface ITransactionCategoriesFormProps {
  className?: string;
  categoryAmount: { [key in number]: number };
  amountMaxValue: number;
  transactionCategories: IOption[];
  transactionCategoryMapping: ITransactionCategoryMapping[] | undefined;
  deleteTransactionCategoryItem(itemKey: number): void;
  setTransactionCategoryItemAmount(itemKey: number, itemValue: number): void;
}

const TransactionCategoriesForm = ({
  className = "",
  categoryAmount,
  transactionCategories,
  amountMaxValue,
  transactionCategoryMapping,
  deleteTransactionCategoryItem,
  setTransactionCategoryItemAmount,
}: ITransactionCategoriesFormProps): JSX.Element => {
  const totalAllocatedAmount = Object.values(categoryAmount)
    .filter((item) => !Number.isNaN(item))
    .reduce((current, previous) => current + previous, 0);

  return (
    <div className={className}>
      {Object.entries(categoryAmount).map(([index, value], arrayIndex) => (
        <TransactionCategoriesFormItem
          categoryAmountIndex={parseInt(index, 10)}
          amountMaxValue={amountMaxValue}
          arrayIndex={arrayIndex}
          categories={transactionCategories}
          categoryMapping={transactionCategoryMapping}
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
        />
      ))}
    </div>
  );
};

export default TransactionCategoriesForm;
