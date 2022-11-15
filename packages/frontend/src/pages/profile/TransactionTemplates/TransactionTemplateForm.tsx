import {
  CreateTransactionTemplateDto,
  TransactionCategoryMappingDto,
  TransactionTemplateType,
  TransactionTemplateTypeMapping,
  TransactionType,
} from '@local/types';
import { ChangeEvent, useEffect, useState } from 'react';

import { Form } from '../../../components/blocks/form/form';
import { TransactionCategoriesForm } from '../../../components/blocks/transaction-categories-form/transaction-categories-form';
import { Alert } from '../../../components/elements/alert/alert';
import { Button } from '../../../components/elements/button/button';
import { Input } from '../../../components/elements/input/input';
import { Loader } from '../../../components/elements/loader/loader';
import { Select, Option } from '../../../components/elements/select/select';
import { useAllAccounts } from '../../../hooks/account/useAllAccounts';
import { useAllTransactionCategoriesForExpenseWithCategoryTree } from '../../../hooks/transactionCategories/useAllTransactionCategoriesForExpense';
import { useAllTransactionCategoriesForIncomeWithCategoryTree } from '../../../hooks/transactionCategories/useAllTransactionCategoriesForIncome';
import { useAllTransactionCategoriesForTransferWithCategoryTree } from '../../../hooks/transactionCategories/useAllTransactionCategoriesForTransfer';
import { ITransactionCategoryWithCategoryTree } from '../../../services/TransactionCategoriesService';
import { capitalize } from '../../../utils/capitalize';

interface TransactionTemplateFormProps {
  amount?: number;
  dayOfMonth?: number;
  description?: string;
  errors: string[];
  fromAccount?: string;
  toAccount?: string;
  templateName?: string;
  templateType?: string;
  transactionType?: string;
  onSubmit(newShortcut: CreateTransactionTemplateDto): void;
  submitLabel: string;
  transactionCategoryMapping?: TransactionCategoryMappingDto[] | null;
  optionalFooterComponent?: React.ReactNode;
}

export const TransactionTemplateForm = ({
  amount,
  dayOfMonth,
  description,
  errors,
  onSubmit,
  submitLabel,
  fromAccount,
  toAccount,
  transactionCategoryMapping = null,
  templateName,
  transactionType,
  templateType,
  optionalFooterComponent,
}: TransactionTemplateFormProps): JSX.Element | null => {
  const { data: accountsRaw } = useAllAccounts();
  const [accounts, setAccounts] = useState<Option[]>();
  const [inputAmountValue, setInputAmountValue] = useState<number | null>(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState(
    transactionType || TransactionType.INCOME
  );
  const [selectedTransactionTemplateType, setSelectedTransactionTemplateType] =
    useState(TransactionTemplateType.MANUAL);

  const handleTransactionTypeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value.toUpperCase() as keyof typeof TransactionType;
    setSelectedTransactionType(TransactionType[value]);
  };

  const handleTransactionTemplateTypeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value.toUpperCase() as keyof typeof TransactionTemplateType;
    setSelectedTransactionTemplateType(TransactionTemplateType[value]);
  };

  useEffect(() => {
    if (amount) {
      setInputAmountValue(amount);
    }
  }, [amount]);

  const [categoryAmount, setCategoryAmount] = useState<{
    [key in number]: number;
  }>([]);

  const addNewCategory = () =>
    setCategoryAmount({
      ...categoryAmount,
      [Math.max(
        ...(Object.keys(categoryAmount).length === 0
          ? [-1]
          : Object.keys(categoryAmount).map((categoryIndex) =>
              parseInt(categoryIndex, 10)
            ))
      ) + 1]: NaN,
    });

  const deleteTransactionCategoryItem = (itemToDelete: number) => {
    const newCategoryAmount = { ...categoryAmount };
    delete newCategoryAmount[itemToDelete];
    setCategoryAmount(newCategoryAmount);
  };

  const setTransactionCategoryItemAmount = (
    itemIndex: number,
    itemAmount: number
  ) => {
    const newCategoryAmount = { ...categoryAmount };
    newCategoryAmount[itemIndex] = itemAmount;
    setCategoryAmount(newCategoryAmount);
  };

  const templateTypes = (
    Object.keys(
      TransactionTemplateType
    ) as (keyof typeof TransactionTemplateType)[]
  ).map((type) => ({
    value: TransactionTemplateType[type],
    label: capitalize(TransactionTemplateTypeMapping[type]),
  }));

  const transactionTypes = (
    Object.keys(TransactionType) as (keyof typeof TransactionType)[]
  )
    .filter((type) => type !== 'ANY')
    .map((type) => ({
      value: TransactionType[type],
      label: capitalize(TransactionType[type]),
    }));

  useEffect(() => {
    setAccounts(
      accountsRaw.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
    );
  }, [accountsRaw]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const {
      templateName: newTemplateName,
      templateType: newTemplateType,
      transactionType: newTransactionType,
      description: newDescription,
      amount: newAmount,
      dayOfMonth: newDayOfMonth,
      fromAccount: newFromAccount,
      toAccount: newToAccount,
    } = event.target;

    const transactionCategoryMappings = Object.keys(categoryAmount).map(
      (item) => {
        const newTransactionCategories =
          event.target[`transactionCategory[${item}]category`];

        return newTransactionCategories.value;
      }
    );

    const isExpenseOrTransfer =
      newTransactionType.value === 'expense' ||
      newTransactionType.value === 'transfer';

    const isIncomeOrTransfer =
      newTransactionType.value === 'income' ||
      newTransactionType.value === 'transfer';

    const isShortcutTypeOfAuto = newTemplateType.value === 'auto';

    const newShortcutData: CreateTransactionTemplateDto = {
      templateName: newTemplateName.value,
      templateType: newTemplateType.value,
      templateVisibility:
        TransactionType[
          newTransactionType.value.toUpperCase() as keyof typeof TransactionType
        ],
      fromAccount: isExpenseOrTransfer ? newFromAccount.value : undefined,
      toAccount: isIncomeOrTransfer ? newToAccount.value : undefined,
      amount: parseFloat((newAmount.value as string).replace(',', '.')),
      description: newDescription.value || '',
      dayOfMonth: isShortcutTypeOfAuto
        ? Number(newDayOfMonth.value)
        : undefined,
      categories: transactionCategoryMappings,
    };

    onSubmit(newShortcutData);
  };

  useEffect(() => {
    if (!transactionCategoryMapping) return;
    const newCategoryAmount: number[] = [];
    transactionCategoryMapping.forEach((_, index) =>
      newCategoryAmount.push(index)
    );
    setCategoryAmount(newCategoryAmount);
  }, [transactionCategoryMapping]);

  const getUseDataHook = () => {
    if (selectedTransactionType === TransactionType.INCOME)
      return useAllTransactionCategoriesForIncomeWithCategoryTree;
    if (selectedTransactionType === TransactionType.EXPENSE)
      return useAllTransactionCategoriesForExpenseWithCategoryTree;

    return useAllTransactionCategoriesForTransferWithCategoryTree;
  };

  const TransactionCategoriesFormWrapper = ({
    useData,
  }: {
    useData: () => ITransactionCategoryWithCategoryTree[];
  }): JSX.Element => {
    const transactionCategoriesRaw: ITransactionCategoryWithCategoryTree[] =
      useData();

    const [transactionCategories, setTransactionCategories] = useState<
      Option[]
    >([]);

    useEffect(() => {
      if (transactionCategoriesRaw === null) return;

      setTransactionCategories(
        transactionCategoriesRaw.map(({ _id, categoryTree }) => ({
          value: _id,
          label: categoryTree,
        }))
      );
    }, [transactionCategoriesRaw]);

    if (!transactionCategories.length) return <Loader />;

    return (
      <TransactionCategoriesForm
        className="my-8 space-y-8"
        categoryAmount={categoryAmount}
        transactionCategories={transactionCategories}
        transactionCategoryMapping={transactionCategoryMapping}
        amountMaxValue={inputAmountValue || 0}
        deleteTransactionCategoryItem={deleteTransactionCategoryItem}
        setTransactionCategoryItemAmount={setTransactionCategoryItemAmount}
        categorySelectOnly
      />
    );
  };

  if (!accounts) return null;

  return (
    <>
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="form-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        submitLabel={submitLabel}
        handleSubmit={handleSubmit}
        formFooterBackLink="/"
        optionalFooterComponent={optionalFooterComponent}
      >
        <section>
          <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input id="templateName" isRequired value={templateName}>
              Template name
            </Input>
            <Select
              id="templateType"
              options={templateTypes}
              defaultValue={templateType ?? selectedTransactionTemplateType}
              isRequired
              handleOnChange={handleTransactionTemplateTypeChange}
              isDisabled
            >
              Template type
            </Select>
            <Select
              id="transactionType"
              options={transactionTypes}
              defaultValue={transactionType ?? selectedTransactionType}
              isRequired
              handleOnChange={handleTransactionTypeChange}
            >
              Transaction type
            </Select>
            <Input id="description" value={description}>
              Description
            </Input>
            <Input
              id="amount"
              type="number"
              min={0.01}
              step={0.01}
              isCurrency
              value={Number.isNaN(amount) ? '' : amount}
            >
              Amount
            </Input>
            {(selectedTransactionType === TransactionType.EXPENSE ||
              selectedTransactionType === TransactionType.TRANSFER) && (
              <Select
                id="fromAccount"
                options={accounts}
                defaultValue={fromAccount}
                isRequired
              >
                From Account
              </Select>
            )}
            {(selectedTransactionType === TransactionType.INCOME ||
              selectedTransactionType === TransactionType.TRANSFER) && (
              <Select
                id="toAccount"
                options={accounts}
                defaultValue={toAccount}
                isRequired
              >
                To Account
              </Select>
            )}
            {selectedTransactionTemplateType ===
              TransactionTemplateType.AUTO && (
              <Input
                id="dayOfMonth"
                type="number"
                min={1}
                max={31}
                isDate
                value={Number.isNaN(dayOfMonth) ? '' : dayOfMonth}
              >
                Day of month
              </Input>
            )}
          </div>
        </section>
        <section className="mt-8">
          <h2 className="sr-only">Categories</h2>
          <TransactionCategoriesFormWrapper useData={getUseDataHook()} />
          <Button
            onClick={addNewCategory}
            accentColor="plain"
            testId="add-category-button"
          >
            Add category item
          </Button>
        </section>
      </Form>
    </>
  );
};
