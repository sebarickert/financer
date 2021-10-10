import React, { ChangeEvent, useEffect, useState } from 'react';

import { Alert } from '../../components/alert/alert';
import { Button } from '../../components/button/button';
import { Form } from '../../components/form/form';
import { Input } from '../../components/input/input';
import { Loader } from '../../components/loader/loader';
import { Select, IOption } from '../../components/select/select';
import { TransactionCategoriesForm } from '../../components/transaction-categories-form/transaction-categories-form';
import { inputDateFormat } from '../../utils/formatDate';
import { getAllAccounts } from '../accounts/AccountService';
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from '../profile/TransactionCategories/TransactionCategoriesService';

interface ITransferFormProps {
  amount?: number;
  date?: Date;
  description?: string;
  errors: string[];
  formHeading: string;
  fromAccount?: string;
  toAccount?: string;
  onSubmit(
    newTransfer: ITransaction,
    transactionCategoryMappings: ITransactionCategoryMapping[]
  ): void;
  submitLabel: string;
  transactionCategoryMapping?: ITransactionCategoryMapping[];
}

export const TransferForm = ({
  amount,
  date,
  description,
  errors,
  formHeading,
  onSubmit,
  submitLabel,
  fromAccount,
  toAccount,
  transactionCategoryMapping,
}: ITransferFormProps): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [accounts, setAccounts] = useState<IOption[] | null>(null);
  const [transactionCategoriesRaw, setTransactionCategoriesRaw] = useState<
    ITransactionCategoryWithCategoryTree[] | null
  >(null);
  const [transactionCategories, setTransactionCategories] = useState<
    IOption[] | null
  >(null);
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
    const fetchAccounts = async () => {
      setAccountsRaw(await getAllAccounts());
    };
    const fetchTransactionCategories = async () => {
      setTransactionCategoriesRaw(
        await getAllTransactionCategoriesWithCategoryTree()
      );
    };
    fetchAccounts();
    fetchTransactionCategories();
  }, []);

  useEffect(() => {
    if (accountsRaw === null) return;

    setAccounts(
      accountsRaw.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
    );
  }, [accountsRaw]);

  useEffect(() => {
    if (transactionCategoriesRaw === null) return;

    setTransactionCategories(
      transactionCategoriesRaw.map(({ _id, categoryTree }) => ({
        value: _id,
        label: categoryTree,
      }))
    );
  }, [transactionCategoriesRaw]);

  useEffect(() => {
    if (typeof transactionCategoryMapping === 'undefined') return;
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
      fromAccount: newFromAccount,
      toAccount: newToAccount,
    } = event.target;

    const newTransferData: ITransaction = {
      fromAccount: newFromAccount.value,
      toAccount: newToAccount.value,
      amount: parseFloat((newAmount.value as string).replace(',', '.')),
      description: newDescription.value,
      date: newDate.value,
    };

    const transactionCategoryMappings: ITransactionCategoryMapping[] =
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

    onSubmit(newTransferData, transactionCategoryMappings);
  };

  return accounts === null || transactionCategories === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="form-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        submitLabel={submitLabel}
        formHeading={formHeading}
        handleSubmit={handleSubmit}
      >
        <section>
          <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input id="description" isRequired value={description}>
              Description
            </Input>
            <Input
              id="amount"
              type="number"
              min={0.0}
              step={0.01}
              isCurrency
              isRequired
              value={Number.isNaN(amount) ? '' : amount}
              onChange={handleAmountInputValueChange}
            >
              Amount
            </Input>
            <Select
              id="fromAccount"
              options={accounts}
              defaultValue={fromAccount}
              isRequired
            >
              From Account
            </Select>
            <Select
              id="toAccount"
              options={accounts}
              defaultValue={toAccount}
              isRequired
            >
              To Account
            </Select>
            <Input
              id="date"
              type="datetime-local"
              value={typeof date !== 'undefined' ? inputDateFormat(date) : ''}
              isDate
            >
              Date
            </Input>
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
            >
              Add category item
            </Button>
          </section>
        )}
      </Form>
    </>
  );
};
