import React, { useEffect, useState } from "react";
import Form from "../../components/form/form";
import Input from "../../components/input/input";
import Select, { IOption } from "../../components/select/select";
import Alert from "../../components/alert/alert";
import Loader from "../../components/loader/loader";
import { inputDateFormat } from "../../utils/formatDate";
import { getAllAccounts } from "../accounts/AccountService";
import { getAllTransactionCategories } from "../profile/TransactionCategories/TransactionCategoriesService";
import Button from "../../components/button/button";

interface IProps {
  amount?: number;
  date?: Date;
  description?: string;
  errors: string[];
  formHeading: string;
  fromAccount?: string;
  onSubmit(
    account: IExpense,
    transactionCategoryMappings: ITransactionCategoryMapping[]
  ): void;
  submitLabel: string;
}

const ExpenseForm = ({
  amount,
  date,
  description,
  errors,
  formHeading,
  onSubmit,
  submitLabel,
  fromAccount,
}: IProps): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [accounts, setAccounts] = useState<IOption[] | null>(null);
  const [transactionCategoriesRaw, setTransactionCategoriesRaw] = useState<
    ITransactionCategory[] | null
  >(null);
  const [transactionCategories, setTransactionCategories] = useState<
    IOption[] | null
  >(null);

  const [categoryAmount, setCategoryAmount] = useState<number[]>([]);
  const addNewCategory = () =>
    setCategoryAmount([
      ...categoryAmount,
      Math.max(...(categoryAmount.length === 0 ? [0] : categoryAmount)) + 1,
    ]);

  const deleteTransactionCategoryItem = (itemToDelete: number) =>
    setCategoryAmount(categoryAmount.filter((item) => item !== itemToDelete));

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccountsRaw(await getAllAccounts());
    };

    const fetchTransactionCategories = async () => {
      setTransactionCategoriesRaw(await getAllTransactionCategories());
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
      transactionCategoriesRaw.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
    );
  }, [transactionCategoriesRaw]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const {
      description: newDescription,
      amount: newAmount,
      date: newDate,
      fromAccount: newFromAccount,
    } = event.target;

    const newExpenseData: IExpense = {
      fromAccount: newFromAccount.value,
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

    onSubmit(newExpenseData, transactionCategoryMappings);
  };

  return accounts === null || transactionCategories === null ? (
    <Loader loaderColor="red" />
  ) : (
    <>
      {errors.length > 0 && (
        <Alert additionalInformation={errors}>
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        submitLabel={submitLabel}
        formHeading={formHeading}
        handleSubmit={handleSubmit}
        accentColor="red"
      >
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <Input
            id="description"
            help="Description of purchase, e.g. rent."
            isRequired
            value={description}
          >
            Description
          </Input>
          <Input
            id="amount"
            help="Amount of the purchase."
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
            Date of the expense
          </Input>
          <Select
            id="fromAccount"
            options={accounts}
            defaultValue={fromAccount}
            isRequired
          >
            Account the expense was made from
          </Select>
        </div>
        <div className="border-t border-gray-200 pt-5 mt-8">
          <h2 className="text-lg font-bold leading-7 text-gray-900 sm:text-2xl sm:leading-9 sm:truncate">
            Categories
          </h2>
          <div className="grid gap-x-4 sm:grid-cols-2">
            {categoryAmount.map((index) => (
              <div
                className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4"
                key={index}
              >
                <Select
                  id={`transactionCategory[${index}]category`}
                  options={transactionCategories}
                  defaultValue={fromAccount}
                  isRequired
                >
                  Transaction categories
                </Select>
                <Input
                  id={`transactionCategory[${index}]amount`}
                  help="Amount of the purchase."
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
                  id={`transactionCategory[${index}]description`}
                  help="Description of purchase, e.g. rent."
                  value={description}
                >
                  Description
                </Input>
                <Button
                  className="mt-4"
                  onClick={() => deleteTransactionCategoryItem(index)}
                  accentColor="red"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button className="mt-4" onClick={addNewCategory} accentColor="green">
          Add category
        </Button>
      </Form>
    </>
  );
};

export default ExpenseForm;
