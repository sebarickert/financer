'use client';

import React, { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { getAllChildCategoryIds } from '../../services/TransactionCategoriesService';

import { TransactionType, VisibilityType } from '$api/generated/financerApi';
import { Form } from '$blocks/Form';
import { TRANSACTION_TYPE_MAPPING } from '$constants/transaction/TRANSACTION_TYPE_MAPPING';
import { Button } from '$elements/Button/Button';
import { Input } from '$elements/Input';
import { InputOption } from '$elements/InputOption';
import { Select } from '$elements/Select';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { TransactionCategoryDtoWithCategoryTree } from '$types/TransactionCategoryDtoWithCategoryTree';

type CategoryFormProps = {
  onSubmit: DefaultFormActionHandler;
  submitLabel: string;
  currentCategoryId?: string;
  initialValues?: Partial<TransactionCategoryFormFields>;
  transactionCategoriesWithCategoryTree?: TransactionCategoryDtoWithCategoryTree[];
};

export type TransactionCategoryFormFields = {
  name: string;
  visibility: TransactionType[];
  parentCategoryId: string | null;
};

const visibilityTypeMapping = {
  [VisibilityType.Income]: {
    label: 'Income',
    icon: TRANSACTION_TYPE_MAPPING.INCOME.icon,
  },
  [VisibilityType.Expense]: {
    label: 'Expense',
    icon: TRANSACTION_TYPE_MAPPING.EXPENSE.icon,
  },
  [VisibilityType.Transfer]: {
    label: 'Transfer',
    icon: TRANSACTION_TYPE_MAPPING.TRANSFER.icon,
  },
};

export const CategoryForm: FC<CategoryFormProps> = ({
  onSubmit,
  submitLabel,
  currentCategoryId,
  initialValues,
  transactionCategoriesWithCategoryTree,
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

  const filteredTransactionCategories = useMemo(() => {
    if (!transactionCategoriesWithCategoryTree) return;

    const forbiddenIds = currentCategoryId
      ? getAllChildCategoryIds(
          currentCategoryId,
          transactionCategoriesWithCategoryTree,
        ).concat(currentCategoryId)
      : [];

    return [
      ...transactionCategoriesWithCategoryTree
        .filter(({ id }) => !forbiddenIds.includes(id))
        .map(({ id, categoryTree: transactionCategoryName }) => ({
          value: id,
          label: transactionCategoryName,
        })),
    ];
  }, [currentCategoryId, transactionCategoriesWithCategoryTree]);

  useEffect(() => {
    if (!initialValues) return;

    reset((previousValues) => ({
      ...previousValues,
      ...defaultValues,
    }));
  }, [defaultValues, initialValues, reset]);

  if (!filteredTransactionCategories) return null;

  return (
    <Form
      methods={methods}
      action={action}
      testId="category-form"
      className="@container"
    >
      <div className="grid gap-6">
        <Input id="name" isRequired>
          Name
        </Input>
        <fieldset
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
                  Icon={icon}
                >
                  {label}
                </InputOption>
              );
            },
          )}
        </fieldset>
        <Select
          id="parentCategoryId"
          options={filteredTransactionCategories}
          placeholder="None"
        >
          Parent transaction category
        </Select>
      </div>
      <Form.Footer>
        <Button type="submit">{submitLabel}</Button>
      </Form.Footer>
    </Form>
  );
};
