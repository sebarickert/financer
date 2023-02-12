import { CreateTransactionCategoryMappingDtoWithoutTransaction } from '@local/types';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import {
  CreateIncomeDto,
  TransactionCategoryMappingDto,
  useAccountsFindAllByUserQuery,
  VisibilityType2Enum,
  VisibilityTypeEnum,
} from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { TransactionCategoriesForm } from '$blocks/transaction-categories-form/transaction-categories-form';
import { Alert } from '$elements/alert/alert';
import { Button } from '$elements/button/button';
import { Input } from '$elements/input/input';
import { Loader } from '$elements/loader/loader';
import { Select, Option } from '$elements/select/select';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { inputDateFormat } from '$utils/formatDate';

interface IncomeFormProps {
  amount?: number;
  date?: Date;
  description?: string;
  errors: string[];
  toAccount?: string;
  onSubmit(account: CreateIncomeDto): void;
  submitLabel: string;
  transactionCategoryMapping?:
    | Pick<TransactionCategoryMappingDto, 'category_id'>[]
    | null;
}

export const IncomeForm = ({
  amount,
  date,
  description,
  errors,
  onSubmit,
  submitLabel,
  toAccount,
  transactionCategoryMapping = null,
}: IncomeFormProps): JSX.Element | null => {
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
        VisibilityTypeEnum.Income as unknown as VisibilityType2Enum,
    });
  const [transactionCategories, setTransactionCategories] = useState<Option[]>(
    []
  );
  const [inputAmountValue, setInputAmountValue] = useState<number | null>(null);

  const handleAmountInputValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setInputAmountValue(parseFloat(event.target.value));
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

  useEffect(() => {
    if (!transactionCategoriesRaw) return;

    setTransactionCategories(
      transactionCategoriesRaw.map(({ _id, categoryTree }) => ({
        value: _id,
        label: categoryTree,
      }))
    );
  }, [transactionCategoriesRaw]);

  useEffect(() => {
    if (!transactionCategoryMapping) return;
    const newCategoryAmount: number[] = [];
    transactionCategoryMapping.forEach((_, index) =>
      newCategoryAmount.push(index)
    );
    setCategoryAmount(newCategoryAmount);
  }, [transactionCategoryMapping]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const {
      description: newDescription,
      amount: newAmount,
      date: newDate,
      toAccount: newToAccount,
    } = event.target;

    const transactionCategoryMappings: CreateTransactionCategoryMappingDtoWithoutTransaction[] =
      Object.keys(categoryAmount).map((item) => {
        const newTransactionCategories =
          event.target[`transactionCategory[${item}]category`];
        const newTransactionCategoriesAmount =
          event.target[`transactionCategory[${item}]amount`];
        const newTransactionCategoriesDescription =
          event.target[`transactionCategory[${item}]description`];

        return {
          category_id: newTransactionCategories.value,
          amount: parseFloat(
            (newTransactionCategoriesAmount.value as string).replace(',', '.')
          ),
          description: newTransactionCategoriesDescription.value,
        };
      });

    const newIncomeData: CreateIncomeDto = {
      toAccount: newToAccount.value,
      amount: parseFloat((newAmount.value as string).replace(',', '.')),
      description: newDescription.value,
      date: newDate.value ? new Date(newDate.value) : newDate.value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: transactionCategoryMappings as any,
    };

    onSubmit(newIncomeData);
  };

  if (!accounts) return null;

  return (
    <Loader isLoading={isLoading}>
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="form-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        submitLabel={submitLabel}
        handleSubmit={handleSubmit}
        formFooterBackLink="/"
      >
        <section>
          <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input id="description" isRequired value={description}>
              Description
            </Input>
            <Input
              id="amount"
              type="number"
              min={0.01}
              step={0.01}
              isCurrency
              isRequired
              value={Number.isNaN(amount) ? '' : amount}
              onChange={handleAmountInputValueChange}
            >
              Amount
            </Input>
            <Input
              id="date"
              type="datetime-local"
              value={typeof date !== 'undefined' ? inputDateFormat(date) : ''}
              isDate
            >
              Date
            </Input>
            <Select
              id="toAccount"
              options={accountOptions}
              defaultValue={toAccount}
              isRequired
            >
              Account
            </Select>
          </div>
        </section>
        {transactionCategories.length > 0 && (
          <section className="mt-8">
            <h2 className="sr-only">Categories</h2>
            <TransactionCategoriesForm
              className="my-8 space-y-8"
              categoryAmount={categoryAmount}
              transactionCategories={transactionCategories}
              transactionCategoryMapping={transactionCategoryMapping}
              amountMaxValue={inputAmountValue || 0}
              deleteTransactionCategoryItem={deleteTransactionCategoryItem}
              setTransactionCategoryItemAmount={
                setTransactionCategoryItemAmount
              }
            />
            <Button
              onClick={addNewCategory}
              accentColor="plain"
              isDisabled={!inputAmountValue || inputAmountValue < 0}
              testId="add-category-button"
            >
              Add category item
            </Button>
          </section>
        )}
      </Form>
    </Loader>
  );
};
