import { CreateTransactionCategoryDto, VisibilityType } from '@local/types';
import React, { useEffect, useState } from 'react';

import { Alert } from '../../../components/alert/alert';
import { Checkbox } from '../../../components/checkbox/checkbox';
import { CheckboxGroup } from '../../../components/checkbox/checkbox.group';
import { Form } from '../../../components/form/form';
import { Input } from '../../../components/input/input';
import { Select, Option } from '../../../components/select/select';
import { useAllTransactionCategoriesWithCategoryTree } from '../../../hooks/transactionCategories/useAllTransactionCategories';

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
    useAllTransactionCategoriesWithCategoryTree(currentCategoryId);
  const [transactionCategories, setTransactionCategories] =
    useState<Option[]>();

  useEffect(() => {
    setTransactionCategories([
      { label: 'None', value: '' },
      ...transactionCategoriesRaw.map(
        ({ _id, categoryTree: transactionCategoryName }) => ({
          value: _id,
          label: transactionCategoryName,
        })
      ),
    ]);
  }, [transactionCategoriesRaw]);

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
        newParentTransactionCategory.value === 'None'
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
        accentColor="green"
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
