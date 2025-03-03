'use client';

import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { CategoriesFormFullFields } from './TransactionCategories/transaction-categories.types';
import { TransactionCategories } from './TransactionCategories/TransactionCategories';

import { SchemaAccountDto } from '@/api/ssr-financer-api';
import { Form } from '@/blocks/Form';
import { ACCOUNT_TYPE_MAPPING } from '@/constants/account/ACCOUNT_TYPE_MAPPING';
import { TRANSACTION_TYPE_MAPPING } from '@/constants/transaction/TRANSACTION_TYPE_MAPPING';
import { Button } from '@/elements/Button/Button';
import { Input } from '@/elements/Input';
import { Select } from '@/elements/Select';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '@/hooks/useFinancerFormState';
import { DATE_FORMAT, DateService } from '@/services/DateService';
import { TransactionCategoryDtoWithCategoryTree } from '@/types/TransactionCategoryDtoWithCategoryTree';
import { formatCurrency } from '@/utils/formatCurrency';

export interface TransactionFormFields {
  amount: number;
  description: string;
  date: string;
  categories: CategoriesFormFullFields[];
  toAccount: string;
  fromAccount: string;
}
interface TransactionFormProps {
  accounts: SchemaAccountDto[];
  hasFromAccountField?: boolean;
  hasToAccountField?: boolean;
  initialValues?: Partial<TransactionFormFields>;
  onSubmit: DefaultFormActionHandler;
  transactionCategoriesWithCategoryTree?: TransactionCategoryDtoWithCategoryTree[];
  testId?: string;
}

export const TransactionForm: FC<TransactionFormProps> = ({
  hasFromAccountField,
  hasToAccountField,
  initialValues,
  onSubmit,
  testId,
  transactionCategoriesWithCategoryTree,
  accounts,
}) => {
  const action = useFinancerFormState('transaction-form', onSubmit);

  const defaultValues = useMemo(
    () => ({
      date: new DateService().format(DATE_FORMAT.INPUT),
      ...initialValues,
      toAccount: initialValues?.toAccount ?? '',
      fromAccount: initialValues?.fromAccount ?? '',
    }),
    [initialValues],
  );

  const methods = useForm<TransactionFormFields>({
    defaultValues,
  });

  const { reset } = methods;

  const accountOptions = useMemo(() => {
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
      // Have to reset categories separately for some odd reason
      categories: defaultValues.categories ?? [],
    });
  }, [defaultValues, initialValues, reset]);

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
              Icon={TRANSACTION_TYPE_MAPPING.EXPENSE.Icon}
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
              Icon={TRANSACTION_TYPE_MAPPING.INCOME.Icon}
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
