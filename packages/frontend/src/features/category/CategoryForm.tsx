'use client';

import React, { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { getAllChildCategoryIds } from '../../services/TransactionCategoriesService';

import { TransactionType, VisibilityType } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { settingsPaths } from '$constants/settings-paths';
import { transactionTypeIconMapping } from '$constants/transaction/transactionTypeIconMapping';
import { Input } from '$elements/Input';
import { InputOption } from '$elements/InputOption';
import { Select, Option } from '$elements/Select';
import { useGetAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useGetAllTransactionCategoriesWithCategoryTree';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';

type CategoryFormProps = {
  onSubmit: DefaultFormActionHandler;
  submitLabel: string;
  optionalFooterComponent?: React.ReactNode;
  currentCategoryId?: string;
  initialValues?: Partial<TransactionCategoryFormFields>;
};

export type TransactionCategoryFormFields = {
  name: string;
  visibility: TransactionType[];
  parentCategoryId: string | null;
};

const visibilityTypeMapping = {
  [VisibilityType.Income]: {
    label: 'Income',
    icon: transactionTypeIconMapping.INCOME,
  },
  [VisibilityType.Expense]: {
    label: 'Expense',
    icon: transactionTypeIconMapping.EXPENSE,
  },
  [VisibilityType.Transfer]: {
    label: 'Transfer',
    icon: transactionTypeIconMapping.TRANSFER,
  },
};

export const CategoryForm: FC<CategoryFormProps> = ({
  onSubmit,
  submitLabel,
  optionalFooterComponent,
  currentCategoryId,
  initialValues,
}) => {
  const action = useFinancerFormState('category-form', onSubmit);

  const defaultValues = useMemo(() => {
    return {
      ...initialValues,
      parentCategoryId: initialValues?.parentCategoryId ?? '',
    };
  }, [initialValues]);

  const methods = useForm<TransactionCategoryFormFields>({
    defaultValues,
  });

  const { reset } = methods;

  const { data: transactionCategoriesRaw } =
    useGetAllTransactionCategoriesWithCategoryTree();
  const [transactionCategories, setTransactionCategories] =
    useState<Option[]>();

  useEffect(() => {
    if (!transactionCategoriesRaw) return;

    const forbiddenIds = currentCategoryId
      ? getAllChildCategoryIds(
          currentCategoryId,
          transactionCategoriesRaw,
        ).concat(currentCategoryId)
      : [];

    setTransactionCategories([
      ...transactionCategoriesRaw
        .filter(({ id }) => !forbiddenIds.includes(id))
        .map(({ id, categoryTree: transactionCategoryName }) => ({
          value: id,
          label: transactionCategoryName,
        })),
    ]);
  }, [currentCategoryId, transactionCategoriesRaw]);

  useEffect(() => {
    if (!initialValues) return;

    reset((previousValues) => ({
      ...previousValues,
      ...defaultValues,
    }));
  }, [defaultValues, initialValues, reset]);

  if (!transactionCategories) return null;

  return (
    <Form
      methods={methods}
      submitLabel={submitLabel}
      action={action}
      formFooterBackLink={settingsPaths.categories}
      optionalFooterComponent={optionalFooterComponent}
      testId="category-form"
      className="@container"
    >
      <div className="grid gap-6">
        <Input id="name" isRequired>
          Name
        </Input>
        <fieldset
          data-testid="visibility-checkboxes"
          className={'grid gap-2 @[600px]:grid-cols-2 @[900px]:grid-cols-3'}
        >
          <legend className="mb-2">Visibility</legend>
          {Object.entries(visibilityTypeMapping).map(
            ([visibilityType, { label, icon }]) => {
              const id = 'visibility';

              return (
                <InputOption
                  key={visibilityType}
                  id={id}
                  value={visibilityType}
                  register={methods.register(id)}
                  type="checkbox"
                  icon={icon}
                >
                  {label}
                </InputOption>
              );
            },
          )}
        </fieldset>
        <Select
          id="parentCategoryId"
          options={transactionCategories}
          placeholder="None"
        >
          Parent transaction category
        </Select>
      </div>
    </Form>
  );
};
