'use client';

import { FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  AccountDto,
  TransactionTemplateType,
  TransactionType,
} from '$api/generated/financerApi';
import { Form } from '$blocks/Form';
import { Button } from '$elements/Button/Button';
import { Input } from '$elements/Input';
import { Select } from '$elements/Select';
import { CategoriesFormOnlyCategory } from '$features/transaction/TransactionCategories/transaction-categories.types';
import { TransactionCategories } from '$features/transaction/TransactionCategories/TransactionCategories';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { TransactionCategoryDtoWithCategoryTree } from '$types/TransactionCategoryDtoWithCategoryTree';
import { capitalize } from '$utils/capitalize';

type TemplateFormProps = {
  onSubmit: DefaultFormActionHandler;
  submitLabel: string;
  initialValues?: Partial<TemplateFormFields>;
  transactionCategoriesWithCategoryTree?: TransactionCategoryDtoWithCategoryTree[];
  accounts?: AccountDto[];
};

export type TemplateFormFields = {
  templateName: string;
  templateType: TransactionTemplateType;
  templateVisibility: TransactionType;
  description: string;
  amount: number;
  fromAccount?: string | null;
  toAccount?: string | null;
  dayOfMonth?: number;
  dayOfMonthToCreate?: number;
  categories: CategoriesFormOnlyCategory[];
};

export const TemplateForm: FC<TemplateFormProps> = ({
  onSubmit,
  submitLabel,
  initialValues,
  transactionCategoriesWithCategoryTree,
  accounts,
}) => {
  const action = useFinancerFormState('add-template', onSubmit);
  const methods = useForm<TemplateFormFields>({
    defaultValues: initialValues,
  });

  const { watch } = methods;

  const templateType = watch('templateType');
  const templateVisibility = watch('templateVisibility');

  const accountOptions = useMemo(() => {
    if (!accounts) return [];
    return accounts.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }, [accounts]);

  const handleSubmit = async (data: FormData) => {
    const submittedTemplateVisibility = data.get('templateVisibility');

    const isExpense = submittedTemplateVisibility === TransactionType.Expense;
    const isIncome = submittedTemplateVisibility === TransactionType.Income;

    if (isExpense) {
      data.delete('toAccount');
    } else if (isIncome) {
      data.delete('fromAccount');
    }

    action(data);
  };

  const templateTypes = (
    Object.keys(
      TransactionTemplateType,
    ) as (keyof typeof TransactionTemplateType)[]
  ).map((type) => ({
    value: TransactionTemplateType[type],
    label: capitalize(TransactionTemplateType[type]),
  }));

  const transactionTypes = (
    Object.keys(TransactionType) as (keyof typeof TransactionType)[]
  ).map((type) => ({
    value: TransactionType[type],
    label: capitalize(TransactionType[type]),
  }));

  const filteredTransactionCategories =
    transactionCategoriesWithCategoryTree?.filter(({ visibility }) =>
      visibility.includes(templateVisibility),
    );

  const transactionCategories = useMemo(() => {
    if (!filteredTransactionCategories) return [];

    return filteredTransactionCategories.map(({ id, categoryTree }) => ({
      value: id,
      label: categoryTree,
    }));
  }, [filteredTransactionCategories]);

  return (
    <Form methods={methods} action={handleSubmit} testId="template-form">
      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select id="templateType" options={templateTypes} isRequired>
            Template type
          </Select>
          <Select id="templateVisibility" options={transactionTypes} isRequired>
            Transaction type
          </Select>
          <Input id="templateName" isRequired>
            Template name
          </Input>
          <Input id="description">Description</Input>
          <Input id="amount" type="number" min={0.01} step={0.01}>
            Amount
          </Input>
          {(templateVisibility === TransactionType.Expense ||
            templateVisibility === TransactionType.Transfer) && (
            <Select
              id="fromAccount"
              options={accountOptions}
              isRequired
              shouldUnregister
            >
              From Account
            </Select>
          )}
          {(templateVisibility === TransactionType.Income ||
            templateVisibility === TransactionType.Transfer) && (
            <Select
              id="toAccount"
              options={accountOptions}
              isRequired
              shouldUnregister
            >
              To Account
            </Select>
          )}
          {templateType === TransactionTemplateType.Auto && (
            <>
              <Input id="dayOfMonth" type="number" min={1} max={31}>
                Day of month for transaction
              </Input>
              <Input id="dayOfMonthToCreate" type="number" min={1} max={31}>
                Day of month to create
              </Input>
            </>
          )}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="sr-only">Categories</h2>
        <TransactionCategories
          categorySelectOnly
          transactionCategories={transactionCategories}
        />
      </section>
      <Form.Footer>
        <Button type="submit">{submitLabel}</Button>
      </Form.Footer>
    </Form>
  );
};
