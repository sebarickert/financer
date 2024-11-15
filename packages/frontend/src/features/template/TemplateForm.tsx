'use client';

import { FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  TransactionTemplateType,
  TransactionType,
  useAccountsFindAllByUserQuery,
  VisibilityType,
} from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { Input } from '$elements/input/input';
import { Select, Option } from '$elements/Select';
import { CategoriesFormOnlyCategory } from '$features/transaction/TransactionCategories/transaction-categories.types';
import { TransactionCategories } from '$features/transaction/TransactionCategories/TransactionCategories';
import { useGetAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useGetAllTransactionCategoriesWithCategoryTree';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { capitalize } from '$utils/capitalize';

type TemplateFormProps = {
  onSubmit: DefaultFormActionHandler;
  submitLabel: string;
  optionalFooterComponent?: React.ReactNode;
  initialValues?: Partial<TemplateFormFields>;
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

type TransactionCategoriesFormWrapperProps = {
  type: VisibilityType;
};

const TransactionCategoriesFormWrapper: FC<
  TransactionCategoriesFormWrapperProps
> = ({ type }) => {
  const { data: transactionCategoriesRaw } =
    useGetAllTransactionCategoriesWithCategoryTree({
      visibilityType: type as unknown as VisibilityType,
    });

  const transactionCategories: Option[] = useMemo(() => {
    if (!transactionCategoriesRaw) return [];

    return transactionCategoriesRaw.map(({ id, categoryTree }) => ({
      value: id,
      label: categoryTree,
    }));
  }, [transactionCategoriesRaw]);

  return (
    <TransactionCategories
      categorySelectOnly
      transactionCategories={transactionCategories}
    />
  );
};

export const TemplateForm: FC<TemplateFormProps> = ({
  onSubmit,
  submitLabel,
  optionalFooterComponent,
  initialValues,
}) => {
  const action = useFinancerFormState('add-template', onSubmit);
  const methods = useForm<TemplateFormFields>({
    defaultValues: initialValues,
  });

  const { watch } = methods;

  const templateType = watch('templateType');
  const templateVisibility = watch('templateVisibility');

  const { data: accounts } = useAccountsFindAllByUserQuery({});

  const accountOptions = useMemo(() => {
    if (!accounts) return [];
    return accounts.data.map(({ id, name }) => ({
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

  const selectedTransactionType = useMemo(() => {
    if (templateVisibility === TransactionType.Income)
      return VisibilityType.Income;
    if (templateVisibility === TransactionType.Expense)
      return VisibilityType.Expense;

    return VisibilityType.Transfer;
  }, [templateVisibility]);

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

  return (
    <Form
      methods={methods}
      action={handleSubmit}
      submitLabel={submitLabel}
      formFooterBackLink="/"
      optionalFooterComponent={optionalFooterComponent}
      testId="template-form"
    >
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
        <TransactionCategoriesFormWrapper type={selectedTransactionType} />
      </section>
    </Form>
  );
};
