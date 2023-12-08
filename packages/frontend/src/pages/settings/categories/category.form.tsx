import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { getAllChildCategoryIds } from '../../../services/TransactionCategoriesService';

import { VisibilityType, VisibilityTypeEnum } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { settingsPaths } from '$constants/settings-paths';
import { Alert } from '$elements/alert/alert';
import { Checkbox } from '$elements/checkbox/checkbox';
import { CheckboxGroup } from '$elements/checkbox/checkbox.group';
import { Input } from '$elements/input/input';
import { Select, Option } from '$elements/select/select';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';

interface CategoryFormProps {
  errors: string[];
  onSubmit: SubmitHandler<TransactionCategoryFormFields>;
  submitLabel: string;
  optionalFooterComponent?: React.ReactNode;
  currentCategoryId?: string;
  initialValues?: Partial<TransactionCategoryFormFields>;
}

export interface TransactionCategoryFormFields {
  name: string;
  visibility: VisibilityType[];
  parent_category_id: string | null;
}

export const CategoryForm = ({
  errors,
  onSubmit,
  submitLabel,
  optionalFooterComponent,
  currentCategoryId,
  initialValues,
}: CategoryFormProps): JSX.Element | null => {
  const methods = useForm<TransactionCategoryFormFields>({
    defaultValues: {
      ...initialValues,
      parent_category_id: initialValues?.parent_category_id ?? '',
    },
  });

  const { data: transactionCategoriesRaw } =
    useAllTransactionCategoriesWithCategoryTree();
  const [transactionCategories, setTransactionCategories] =
    useState<Option[]>();

  useEffect(() => {
    if (!transactionCategoriesRaw) return;

    const forbiddenIds = currentCategoryId
      ? getAllChildCategoryIds(
          currentCategoryId,
          transactionCategoriesRaw
        ).concat(currentCategoryId)
      : [];

    setTransactionCategories([
      { label: 'None', value: '' },
      ...transactionCategoriesRaw
        .filter(({ _id }) => !forbiddenIds.includes(_id))
        .map(({ _id, categoryTree: transactionCategoryName }) => ({
          value: _id,
          label: transactionCategoryName,
        })),
    ]);
  }, [currentCategoryId, transactionCategoriesRaw]);

  if (!transactionCategories) return null;

  return (
    <>
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="form-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        methods={methods}
        submitLabel={submitLabel}
        onSubmit={onSubmit}
        formFooterBackLink={settingsPaths.categories}
        optionalFooterComponent={optionalFooterComponent}
      >
        <div className="grid gap-4">
          <Input id="name" isRequired>
            Name
          </Input>
          <CheckboxGroup testId="visibility-checkboxes" className="-mx-4">
            <Checkbox
              id="incomeVisible"
              name="visibility"
              label="Income"
              value={VisibilityTypeEnum.Income}
            />
            <Checkbox
              id="expenseVisible"
              name="visibility"
              label="Expense"
              value={VisibilityTypeEnum.Expense}
            />
            <Checkbox
              id="transferVisible"
              name="visibility"
              label="Transfer"
              value={VisibilityTypeEnum.Transfer}
            />
          </CheckboxGroup>
          <Select id="parent_category_id" options={transactionCategories}>
            Parent transaction category
          </Select>
        </div>
      </Form>
    </>
  );
};
