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
            <button
              className="inline-flex justify-between w-full text-xs font-semibold uppercase leading-5 tracking-wider bg-white border border-gray-300 rounded-md items-center py-3 pl-6 pr-3 focus-within:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150 hover:bg-gray-50"
              type="button"
              onClick={addNewCategory}
            >
              Add category item
              <span className="text-gray-500">
                <Icon type="plus" />
              </span>
            </button>
            <div className="mt-8 space-y-8">
              {categoryAmount.map((index, arrayIndex) => (
                <div>
                  <Divider>{`Category Item #${arrayIndex + 1}`}</Divider>
                  <div
                    className="grid sm:grid-cols-[1fr,auto] gap-6 sm:gap-4 items-start mt-4"
                    key={index}
                  >
                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <Select
                          id={`transactionCategory[${index}]category`}
                          options={transactionCategories}
                          defaultValue={
                            transactionCategoryMapping
                              ? transactionCategoryMapping[index].category_id ||
                                ""
                              : ""
                          }
                          isRequired
                        >
                          Category
                        </Select>
                        <div className="grid grid-cols-[1fr,auto] gap-2 items-end">
                          <Input
                            id={`transactionCategory[${index}]amount`}
                            type="number"
                            min={0.0}
                            step={0.01}
                            isCurrency
                            isRequired
                            value={
                              transactionCategoryMapping &&
                              !Number.isNaN(
                                transactionCategoryMapping[index].amount
                              )
                                ? transactionCategoryMapping[index].amount
                                : ""
                            }
                          >
                            Amount
                          </Input>
                          <button
                            type="button"
                            className="border-gray-300 bg-white text-gray-700 shadow-sm hover:text-gray-500 inline-flex justify-center w-16 rounded-md items-center py-3 border font-medium text-base  focus-within:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150 h-[50px]"
                          >
                            <span className="sr-only">
                              Add unallocated amount
                            </span>
                            <Icon type="plus-circle" />
                          </button>
                        </div>
                      </div>
                      <Input
                        id={`transactionCategory[${index}]description`}
                        value={
                          transactionCategoryMapping
                            ? transactionCategoryMapping[index].description ||
                              ""
                            : ""
                        }
                      >
                        Description
                      </Input>
                    </div>
                    <Button
                      className="sm:mt-6"
                      onClick={() => deleteTransactionCategoryItem(index)}
                      accentColor="plain"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </Form>
    </>
  );
};

export default IncomeForm;
