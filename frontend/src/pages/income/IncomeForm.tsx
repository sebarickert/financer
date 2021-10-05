import React, { useEffect, useState } from "react";
import Form from "../../components/form/form";
import Input from "../../components/input/input";
import Select, { IOption } from "../../components/select/select";
import Alert from "../../components/alert/alert";
import Loader from "../../components/loader/loader";
import { inputDateFormat } from "../../utils/formatDate";
import { getAllAccounts } from "../accounts/AccountService";
import Button from "../../components/button/button";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "../profile/TransactionCategories/TransactionCategoriesService";
import Icon from "../../components/icon/icon";
import Divider from "../../components/divider/divider";
import TransactionCategoriesForm from "../../components/transaction-categories-form/transaction-categories-form";

interface IProps {
  amount?: number;
  date?: Date;
  description?: string;
  errors: string[];
  formHeading: string;
  toAccount?: string;
  onSubmit(
    account: IExpense,
    transactionCategoryMappings: ITransactionCategoryMapping[]
  ): void;
  submitLabel: string;
  transactionCategoryMapping?: ITransactionCategoryMapping[];
}

const IncomeForm = ({
  amount,
  date,
  description,
  errors,
  formHeading,
  onSubmit,
  submitLabel,
  toAccount,
  transactionCategoryMapping,
}: IProps): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [accounts, setAccounts] = useState<IOption[] | null>(null);
  const [transactionCategoriesRaw, setTransactionCategoriesRaw] = useState<
    ITransactionCategoryWithCategoryTree[] | null
  >(null);
  const [transactionCategories, setTransactionCategories] = useState<
    IOption[] | null
  >(null);

  const [categoryAmount, setCategoryAmount] = useState<number[]>([]);
  const addNewCategory = () =>
    setCategoryAmount([
      ...categoryAmount,
      Math.max(...(categoryAmount.length === 0 ? [-1] : categoryAmount)) + 1,
    ]);

  const deleteTransactionCategoryItem = (itemToDelete: number) =>
    setCategoryAmount(categoryAmount.filter((item) => item !== itemToDelete));

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
    if (typeof transactionCategoryMapping === "undefined") return;
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
    const newIncomeData: IIncome = {
      toAccount: newToAccount.value,
      amount: parseFloat((newAmount.value as string).replace(",", ".")),
      description: newDescription.value,
      date: newDate.value,
    };

    const transactionCategoryMappings: ITransactionCategoryMapping[] =
      categoryAmount.map((item) => {
        const newTransactionCategories =
          event.target[`transactionCategory[${item}]category`];
        const newTransactionCategoriesAmount =
          event.target[`transactionCategory[${item}]amount`];
        const newTransactionCategoriesDescription =
          event.target[`transactionCategory[${item}]description`];

        return {
          category_id: newTransactionCategories.value,
          amount: parseFloat(
            (newTransactionCategoriesAmount.value as string).replace(",", ".")
          ),
          description: newTransactionCategoriesDescription.value,
        };
      });

    onSubmit(newIncomeData, transactionCategoryMappings);
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
        accentColor="green"
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
              value={Number.isNaN(amount) ? "" : amount}
            >
              Amount
            </Input>
            <Input
              id="date"
              type="datetime-local"
              value={typeof date !== "undefined" ? inputDateFormat(date) : ""}
              isDate
            >
              Date
            </Input>
            <Select
              id="toAccount"
              options={accounts}
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
              deleteTransactionCategoryItem={deleteTransactionCategoryItem}
            />
            <Button onClick={addNewCategory} accentColor="plain">
              Add category item
            </Button>
          </section>
        )}
      </Form>
    </>
  );
};

export default IncomeForm;
