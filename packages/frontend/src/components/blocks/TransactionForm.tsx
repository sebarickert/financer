'use client';

import clsx from 'clsx';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  VisibilityType,
  useAccountsFindAllByUserQuery,
} from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { TransactionCategories } from '$blocks/transaction-categories/transaction-categories';
import { CategoriesFormFullFields } from '$blocks/transaction-categories/transaction-categories.types';
import { accountTypeIconMapping } from '$constants/account/accountTypeMapping';
import { Input } from '$elements/input/input';
import { Option, Select } from '$elements/select/select';
import { useGetAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useGetAllTransactionCategoriesWithCategoryTree';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { formatCurrency } from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';

interface TransactionFormProps {
  hasFromAccountField?: boolean;
  hasToAccountField?: boolean;
  initialValues?: Partial<TransactionFormFields>;
  onSubmit: DefaultFormActionHandler;
  testId?: string;
}
export interface TransactionFormFields {
  amount: number;
  description: string;
  date: string;
  categories: CategoriesFormFullFields[];
  toAccount: string;
  fromAccount: string;
}

export const TransactionForm: FC<TransactionFormProps> = ({
  hasFromAccountField,
  hasToAccountField,
  initialValues,
  onSubmit,
  testId,
}) => {
  const action = useFinancerFormState('transaction-form', onSubmit);

  const defaultValues = useMemo(
    () => ({
      date: formatDate(new Date(), DateFormat.input),
      ...initialValues,
      toAccount: initialValues?.toAccount || '',
      fromAccount: initialValues?.fromAccount || '',
    }),
    [initialValues],
  );

  const methods = useForm<TransactionFormFields>({
    defaultValues,
  });

  const { reset } = methods;

  const { data: accounts } = useAccountsFindAllByUserQuery({});

  const accountOptions = useMemo(() => {
    if (!accounts) return [];
    return accounts.data.map(({ id, name, type, balance }) => ({
      value: id,
      label: name,
      icon: accountTypeIconMapping[type],
      description: `Balance ${formatCurrency(balance)}`,
    }));
  }, [accounts]);

  const visibilityType = useMemo(() => {
    if (hasToAccountField && hasFromAccountField) {
      return VisibilityType.Transfer;
    }

    if (hasToAccountField && !hasFromAccountField) {
      return VisibilityType.Income;
    }

    if (hasFromAccountField && !hasToAccountField) {
      return VisibilityType.Expense;
    }
  }, [hasFromAccountField, hasToAccountField]) as unknown as VisibilityType;

  const { data: transactionCategoriesRaw } =
    useGetAllTransactionCategoriesWithCategoryTree({
      visibilityType,
    });

  const [transactionCategories, setTransactionCategories] = useState<Option[]>(
    [],
  );

  useEffect(() => {
    if (!transactionCategoriesRaw) return;

    setTransactionCategories(
      transactionCategoriesRaw.map(({ id, categoryTree }) => ({
        value: id,
        label: categoryTree,
      })),
    );
  }, [transactionCategoriesRaw]);

  useEffect(() => {
    if (!initialValues) return;

    reset((previousValues) => ({
      ...previousValues,
      ...defaultValues,
    }));
  }, [defaultValues, initialValues, reset]);

  if (!accounts) return null;

  return (
    <Form
      methods={methods}
      action={action}
      submitLabel={'Submit'}
      formFooterBackLink="/"
      testId={testId ?? 'transaction-form'}
    >
      <section>
        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
          <div
            className={clsx({
              'max-sm:grid max-sm:grid-cols-2 max-sm:gap-x-4 sm:contents':
                hasFromAccountField && hasToAccountField,
            })}
          >
            {hasFromAccountField && (
              <Select
                id="fromAccount"
                options={accountOptions}
                isRequired
                placeholder="Select Account"
              >
                From Account
              </Select>
            )}
            {hasToAccountField && (
              <Select
                id="toAccount"
                options={accountOptions}
                isRequired
                placeholder="Select Account"
              >
                To Account
              </Select>
            )}
          </div>
          <Input id="amount" type="number" min={0.01} step={0.01} isRequired>
            Amount
          </Input>
          <Input id="description" isRequired>
            Description
          </Input>
          <Input id="date" type="datetime-local">
            Date
          </Input>
        </div>
      </section>
      {transactionCategories.length > 0 && (
        <section className="mt-8">
          <h2 className="sr-only">Categories</h2>
          <TransactionCategories
            transactionCategories={transactionCategories}
          />
        </section>
      )}
    </Form>
  );
};
