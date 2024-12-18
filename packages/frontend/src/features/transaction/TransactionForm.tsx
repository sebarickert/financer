'use client';

import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { CategoriesFormFullFields } from './TransactionCategories/transaction-categories.types';
import { TransactionCategories } from './TransactionCategories/TransactionCategories';

import { useAccountsFindAllByUserQuery } from '$api/generated/financerApi';
import { Form } from '$blocks/Form';
import { ACCOUNT_TYPE_MAPPING } from '$constants/account/ACCOUNT_TYPE_MAPPING';
import { TRANSACTION_TYPE_MAPPING } from '$constants/transaction/TRANSACTION_TYPE_MAPPING';
import { Button } from '$elements/Button/Button';
import { Input } from '$elements/Input';
import { Select } from '$elements/Select';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { DATE_FORMAT, DateService } from '$services/DateService';
import { TransactionCategoryDtoWithCategoryTree } from '$types/TransactionCategoryDtoWithCategoryTree';
import { formatCurrency } from '$utils/formatCurrency';

interface TransactionFormProps {
  hasFromAccountField?: boolean;
  hasToAccountField?: boolean;
  initialValues?: Partial<TransactionFormFields>;
  onSubmit: DefaultFormActionHandler;
  transactionCategoriesWithCategoryTree?: TransactionCategoryDtoWithCategoryTree[];
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
  transactionCategoriesWithCategoryTree,
}) => {
  const action = useFinancerFormState('transaction-form', onSubmit);

  const defaultValues = useMemo(
    () => ({
      date: new DateService().format(DATE_FORMAT.INPUT),
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
    return accounts.map(({ id, name, type, balance }) => ({
      value: id,
      label: name,
      Icon: ACCOUNT_TYPE_MAPPING[type].Icon,
      description: `Balance ${formatCurrency(balance)}`,
    }));
  }, [accounts]);

  const transactionCategories = useMemo(() => {
    if (!transactionCategoriesWithCategoryTree) return [];

    return transactionCategoriesWithCategoryTree.map(
      ({ id, categoryTree }) => ({
        value: id,
        label: categoryTree,
      }),
    );
  }, [transactionCategoriesWithCategoryTree]);

  useEffect(() => {
    if (!initialValues) return;

    reset({
      ...defaultValues,
      categories: defaultValues.categories || [], // Have to reset categories separately for some odd reason
    });
  }, [defaultValues, initialValues, reset]);

  if (!accounts) return null;

  return (
    <Form
      methods={methods}
      action={action}
      testId={testId ?? 'transaction-form'}
    >
      <section>
        <div className="grid gap-4">
          {hasFromAccountField && (
            <Select
              id="fromAccount"
              options={accountOptions}
              isRequired
              placeholder="Select Account"
              isLabelHidden
              Icon={TRANSACTION_TYPE_MAPPING.EXPENSE.icon}
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
              isLabelHidden
              Icon={TRANSACTION_TYPE_MAPPING.INCOME.icon}
            >
              To Account
            </Select>
          )}
          <Input
            id="amount"
            type="number"
            min={0.01}
            step={0.01}
            isRequired
            isLabelHidden
          >
            Amount
          </Input>
          <Input id="description" isRequired isLabelHidden>
            Description
          </Input>
          <Input id="date" type="datetime-local" isLabelHidden>
            Date
          </Input>
        </div>
      </section>
      {transactionCategories.length > 0 && (
        <section className="mt-4">
          <TransactionCategories
            transactionCategories={transactionCategories}
          />
        </section>
      )}
      <Form.Footer>
        <Button type="submit">Submit</Button>
      </Form.Footer>
    </Form>
  );
};
