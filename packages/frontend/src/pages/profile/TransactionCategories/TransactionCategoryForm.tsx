import { CreateTransactionCategoryDto, VisibilityType } from '@local/types';
import React, { useEffect, useState } from 'react';

import { Form } from '../../../components/blocks/form/form';
import { Alert } from '../../../components/elements/alert/alert';
import { Checkbox } from '../../../components/elements/checkbox/checkbox';
import { CheckboxGroup } from '../../../components/elements/checkbox/checkbox.group';
import { Input } from '../../../components/elements/input/input';
import { Select, Option } from '../../../components/elements/select/select';
import { useAllTransactionCategoriesWithCategoryTree } from '../../../hooks/transactionCategories/useAllTransactionCategories';
import { getAllChildCategoryIds } from '../../../services/TransactionCategoriesService';

interface TransactionCategoryFormProps {
  errors: string[];
  onSubmit(transactionCategory: CreateTransactionCategoryDto): void;
  submitLabel: string;
  name?: string;
  visibility?: VisibilityType[];
  parentTransactioCategoryId?: string | null;
  optionalFooterComponent?: React.ReactNode;
  currentCategoryId?: string;
}

export const TransactionCategoryForm = ({
  errors,
  onSubmit,
  parentTransactioCategoryId,
  submitLabel,
  name,
  visibility,
  optionalFooterComponent,
  currentCategoryId,
}: TransactionCategoryFormProps): JSX.Element | null => {
  const transactionCategoriesRaw =
    useAllTransactionCategoriesWithCategoryTree();
  const [transactionCategories, setTransactionCategories] =
    useState<Option[]>();

  useEffect(() => {
    const forbiddenIds = currentCategoryId
      ? getAllChildCategoryIds(
          currentCategoryId,
          transactionCategoriesRaw
        ).concat(currentCategoryId)
      : [];

    setTransactionCategories([
      { label: 'None', value: 'none' },
      ...transactionCategoriesRaw
        .filter(({ _id }) => !forbiddenIds.includes(_id))
        .map(({ _id, categoryTree: transactionCategoryName }) => ({
          value: _id,
          label: transactionCategoryName,
        })),
    ]);
  }, [currentCategoryId, transactionCategoriesRaw]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const {
      name: newCategoryName,
      parentTransactionCategory: newParentTransactionCategory,
      incomeVisible: newIncomeVisible,
      expenseVisible: newExpenseVisible,
      transferVisible: newTransferVisible,
    } = event.target;

    const newVisibility = [
      newIncomeVisible.checked ? 'income' : '',
      newExpenseVisible.checked ? 'expense' : '',
      newTransferVisible.checked ? 'transfer' : '',
    ].filter((i) => i !== '') as VisibilityType[];

    const newTransactionCategoryData: CreateTransactionCategoryDto = {
      name: newCategoryName.value,
      parent_category_id:
        newParentTransactionCategory.value === 'none'
          ? null
          : newParentTransactionCategory.value,
      visibility: newVisibility,
    };

    onSubmit(newTransactionCategoryData);
  };

  if (!transactionCategories) return null;

  return (
    <>
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="form-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        submitLabel={submitLabel}
        handleSubmit={handleSubmit}
        formFooterBackLink="/profile/transaction-categories"
        optionalFooterComponent={optionalFooterComponent}
      >
        <div className="grid gap-y-6 gap-x-4">
          <Input
            id="name"
            help="Name of the transaction category, e.g. food, hobby, car, etc."
            isRequired
            value={name}
          >
            Name
          </Input>
          <CheckboxGroup testId="visibility-checkboxes">
            <Checkbox
              id="incomeVisible"
              label="Income"
              checked={visibility?.some((item) => item === 'income')}
            />
            <Checkbox
              id="expenseVisible"
              label="Expense"
              checked={visibility?.some((item) => item === 'expense')}
            />
            <Checkbox
              id="transferVisible"
              label="Transfer"
              checked={visibility?.some((item) => item === 'transfer')}
            />
          </CheckboxGroup>
          <Select
            id="parentTransactionCategory"
            options={transactionCategories}
            defaultValue={parentTransactioCategoryId || undefined}
          >
            Parent transaction category
          </Select>
        </div>
      </Form>
    </>
  );
};
