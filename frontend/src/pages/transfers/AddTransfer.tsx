import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "../../components/form/form";
import Input from "../../components/input/input";
import Select, { IOption } from "../../components/select/select";
import Alert from "../../components/alert/alert";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import { getAllAccounts } from "../accounts/AccountService";
import { addTransaction } from "../../services/TransactionService";
import Container from "../../components/container/container";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "../profile/TransactionCategories/TransactionCategoriesService";
import Button from "../../components/button/button";
import { addTransactionCategoryMapping } from "../expenses/AddExpense";

const AddTransfer = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { description, amount, date, fromAccount, toAccount } = event.target;
    const newTransferData: ITransaction = {
      fromAccount: fromAccount.value,
      toAccount: toAccount.value,
      amount: parseFloat((amount.value as string).replace(",", ".")),
      description: description.value,
      date: date.value,
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

    try {
      const newTransactionJson = await addTransaction(newTransferData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newTransactionCategoryMappingJson =
        await addTransactionCategoryMapping(
          transactionCategoryMappings.map(
            (newTransactionCategoryMappingData) => ({
              ...newTransactionCategoryMappingData,
              transaction_id: newTransactionJson.payload._id,
            })
          )
        );

      if (newTransactionJson.status === 201) {
        history.push("/accounts");
      } else if (newTransactionJson.status === 400) {
        setErrors(newTransactionJson?.errors || ["Unknown error."]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return accounts === null || transactionCategories === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <Container className="mt-6 sm:mt-12">
      <SEO title="Transfer between accounts | Accounts" />
      {errors.length > 0 && (
        <Alert additionalInformation={errors}>
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        submitLabel="Transfer"
        formHeading="Transfer money between accounts"
        handleSubmit={handleSubmit}
        accentColor="blue"
        formFooterBackLink="/accounts"
      >
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <Input
            id="description"
            help="Description of purchase, e.g. rent."
            isRequired
          >
            Description
          </Input>
          <Input id="amount" help="Amount of transfer." isCurrency isRequired>
            Amount
          </Input>
          <Input id="date" type="datetime-local" isDate>
            Date of the transfer
          </Input>
          <Select id="fromAccount" options={accounts} isRequired>
            The account from which the money is taken
          </Select>
          <Select id="toAccount" options={accounts} isRequired>
            The account to which the money will be added
          </Select>
        </div>
        {transactionCategories.length > 0 && (
          <>
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
                      isRequired
                    >
                      Categories
                    </Select>
                    <Input
                      id={`transactionCategory[${index}]amount`}
                      help="Amount of the purchase."
                      type="number"
                      min={0.0}
                      step={0.01}
                      isCurrency
                      isRequired
                    >
                      Amount
                    </Input>
                    <Input
                      id={`transactionCategory[${index}]description`}
                      help="Description of purchase, e.g. rent."
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

            <Button
              className="mt-4"
              onClick={addNewCategory}
              accentColor="green"
            >
              Add category
            </Button>
          </>
        )}
      </Form>
    </Container>
  );
};

export default AddTransfer;
