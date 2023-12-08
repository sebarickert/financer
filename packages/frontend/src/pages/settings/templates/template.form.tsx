import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  TransactionTemplateTypeEnum,
  TransactionType,
  TransactionTypeEnum,
  useAccountsFindAllByUserQuery,
  VisibilityType2Enum,
  VisibilityTypeEnum,
} from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import {
  TransactionCategories,
  TransactionCategoriesFormFields,
} from '$blocks/transaction-categories/transaction-categories';
import { Alert } from '$elements/alert/alert';
import { Input } from '$elements/input/input';
import { Loader } from '$elements/loader/loader';
import { Select, Option } from '$elements/select/select';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { capitalize } from '$utils/capitalize';

interface TemplateFormProps {
  errors: string[];
  onSubmit: SubmitHandler<TemplateFormFields>;
  submitLabel: string;
  optionalFooterComponent?: React.ReactNode;
  initialValues?: Partial<TemplateFormFields>;
}

export interface TemplateFormFields {
  templateName: string;
  templateType: TransactionTemplateTypeEnum;
  templateVisibility: TransactionType;
  description: string;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  dayOfMonth?: number;
  dayOfMonthToCreate?: number;
  categories: TransactionCategoriesFormFields[];
}

const TransactionCategoriesFormWrapper = ({
  type,
}: {
  type: VisibilityTypeEnum;
}): JSX.Element | null => {
  const { data: transactionCategoriesRaw } =
    useAllTransactionCategoriesWithCategoryTree({
      visibilityType: type as unknown as VisibilityType2Enum,
    });

  const transactionCategories: Option[] = useMemo(() => {
    if (!transactionCategoriesRaw) return [];

    return transactionCategoriesRaw.map(({ _id, categoryTree }) => ({
      value: _id,
      label: categoryTree,
    }));
  }, [transactionCategoriesRaw]);

  if (!transactionCategories.length) return <Loader />;

  return (
    <TransactionCategories
      className="my-8 space-y-8"
      categorySelectOnly
      transactionCategories={transactionCategories}
    />
  );
};

export const TemplateForm = ({
  errors,
  onSubmit,
  submitLabel,
  optionalFooterComponent,
  initialValues,
}: TemplateFormProps): JSX.Element | null => {
  const methods = useForm<TemplateFormFields>({
    defaultValues: initialValues,
  });

  const { watch, reset } = methods;

  const templateType = watch('templateType');
  const templateVisibility = watch('templateVisibility');

  const initialTemplateType =
    TransactionTemplateTypeEnum[
      capitalize(
        initialValues?.templateType?.[0] ?? 'manual'
      ) as keyof typeof TransactionTemplateTypeEnum
    ];

  const { data: accounts, isLoading } = useAccountsFindAllByUserQuery({});

  const accountOptions = useMemo(() => {
    if (!accounts) return [];
    return accounts.data.map(({ _id, name }) => ({
      value: _id,
      label: name,
    }));
  }, [accounts]);

  const handleSubmit = async (data: TemplateFormFields) => {
    onSubmit(data);
  };

  const selectedTransactionType = useMemo(() => {
    if (templateVisibility === TransactionTypeEnum.Income)
      return VisibilityTypeEnum.Income;
    if (templateVisibility === TransactionTypeEnum.Expense)
      return VisibilityTypeEnum.Expense;

    return VisibilityTypeEnum.Transfer;
  }, [templateVisibility]);

  const templateTypes = (
    Object.keys(
      TransactionTemplateTypeEnum
    ) as (keyof typeof TransactionTemplateTypeEnum)[]
  ).map((type) => ({
    value: TransactionTemplateTypeEnum[type],
    label: capitalize(TransactionTemplateTypeEnum[type]),
  }));

  const transactionTypes = (
    Object.keys(TransactionTypeEnum) as (keyof typeof TransactionTypeEnum)[]
  )
    .filter((type) => type !== 'Any')
    .map((type) => ({
      value: TransactionTypeEnum[type],
      label: capitalize(TransactionTypeEnum[type]),
    }));

  useEffect(() => {
    if (!initialValues) return;

    reset((previousValues) => ({
      ...previousValues,
      templateType: initialTemplateType,
    }));
  }, [initialTemplateType, initialValues, reset]);

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
        onSubmit={handleSubmit}
        formFooterBackLink="/"
        optionalFooterComponent={optionalFooterComponent}
      >
        <section>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select id="templateType" options={templateTypes} isRequired>
              Template type
            </Select>
            <Select
              id="templateVisibility"
              options={transactionTypes}
              isRequired
            >
              Transaction type
            </Select>
            <Input id="templateName" isRequired>
              Template name
            </Input>
            <Input id="description">Description</Input>
            <Input id="amount" type="number" min={0.01} step={0.01} isCurrency>
              Amount
            </Input>
            {(templateVisibility === TransactionTypeEnum.Expense ||
              templateVisibility === TransactionTypeEnum.Transfer) && (
              <Select id="fromAccount" options={accountOptions} isRequired>
                From Account
              </Select>
            )}
            {(templateVisibility === TransactionTypeEnum.Income ||
              templateVisibility === TransactionTypeEnum.Transfer) && (
              <Select id="toAccount" options={accountOptions} isRequired>
                To Account
              </Select>
            )}
            {templateType === TransactionTemplateTypeEnum.Auto && (
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
    </Loader>
  );
};
