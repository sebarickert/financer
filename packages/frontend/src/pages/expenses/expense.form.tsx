import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  useAccountsFindAllByUserQuery,
  VisibilityType2Enum,
  VisibilityTypeEnum,
} from '$api/generated/financerApi';
import { AccountsSelect } from '$blocks/accounts-select/accounts-select';
import { Form } from '$blocks/form/form';
import {
  TransactionCategories,
  TransactionCategoriesFormFields,
} from '$blocks/transaction-categories/transaction-categories';
import { Alert } from '$elements/alert/alert';
import { IconName } from '$elements/icon/icon';
import { Input } from '$elements/input/input';
import { Loader } from '$elements/loader/loader';
import { Option } from '$elements/select/select';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { inputDateFormat } from '$utils/formatDate';

interface ExpenseFormProps {
  errors: string[];
  onSubmit: SubmitHandler<ExpenseFormFields>;
  submitLabel: string;
  initialValues?: Partial<ExpenseFormFields>;
}

export interface ExpenseFormFields {
  amount: number;
  description: string;
  date: string;
  fromAccount: string;
  categories: TransactionCategoriesFormFields[];
}

export const ExpenseForm = ({
  errors,
  onSubmit,
  submitLabel,
  initialValues,
}: ExpenseFormProps): JSX.Element | null => {
  const defaultValues = useMemo(
    () => ({
      date: inputDateFormat(new Date()),
      ...initialValues,
      fromAccount: initialValues?.fromAccount || undefined,
    }),
    [initialValues]
  );

  const methods = useForm<ExpenseFormFields>({
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const { data: accounts, isLoading } = useAccountsFindAllByUserQuery({});
  const accountOptions = useMemo(() => {
    if (!accounts) return [];
    return accounts.data.map(({ _id, name }) => ({
      value: _id,
      label: name,
    }));
  }, [accounts]);
  const { data: transactionCategoriesRaw } =
    useAllTransactionCategoriesWithCategoryTree({
      visibilityType:
        VisibilityTypeEnum.Expense as unknown as VisibilityType2Enum,
    });
  const [transactionCategories, setTransactionCategories] = useState<Option[]>(
    []
  );

  useEffect(() => {
    if (!transactionCategoriesRaw) return;

    setTransactionCategories(
      transactionCategoriesRaw.map(({ _id, categoryTree }) => ({
        value: _id,
        label: categoryTree,
      }))
    );
  }, [transactionCategoriesRaw]);

  if (!accountOptions) return null;

  return (
    <Loader isLoading={isLoading}>
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="form-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        methods={methods}
        submitLabel={submitLabel}
        onSubmit={onSubmit}
        formFooterBackLink="/"
      >
        <section>
          <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
            <AccountsSelect
              id="fromAccount"
              options={accountOptions}
              isRequired
              icon={IconName.upload}
            >
              Account
            </AccountsSelect>
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
              className="my-8 space-y-8"
              transactionCategories={transactionCategories}
            />
          </section>
        )}
      </Form>
    </Loader>
  );
};
