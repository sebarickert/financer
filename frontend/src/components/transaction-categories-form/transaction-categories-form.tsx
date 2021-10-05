import React from "react";
import { IOption } from "../select/select";
import TransactionCategoriesFormItem from "./transaction-categories-form.item";

interface ITransactionCategoriesFormProps {
  className?: string;
  categoryAmount: number[];
  transactionCategories: IOption[];
  transactionCategoryMapping: ITransactionCategoryMapping[] | undefined;
  deleteTransactionCategoryItem(itemKey: number): void;
}

const TransactionCategoriesForm = ({
  className = "",
  categoryAmount,
  transactionCategories,
  transactionCategoryMapping,
  deleteTransactionCategoryItem,
}: ITransactionCategoriesFormProps): JSX.Element => {
  return (
    <div className={className}>
      {categoryAmount.map((index, arrayIndex) => (
        <TransactionCategoriesFormItem
          categoryAmountIndex={index}
          arrayIndex={arrayIndex}
          categories={transactionCategories}
          categoryMapping={transactionCategoryMapping}
          deleteTransactionCategoryItem={() =>
            deleteTransactionCategoryItem(index)
          }
        />
      ))}
    </div>
  );
};

export default TransactionCategoriesForm;
