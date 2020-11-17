import React, { useEffect, useState } from "react";
import Form from "../../components/form/form";
import Input from "../../components/input/input";
import Select, { IOption } from "../../components/select/select";
import Alert from "../../components/alert/alert";
import Loader from "../../components/loader/loader";
import { inputDateFormat } from "../../utils/formatDate";

interface IProps {
  amount?: number;
  date?: Date;
  description?: string;
  errors: string[];
  formHeading: string;
  fromAccount?: string;
  onSubmit(account: IExpense): void;
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
  const [accounts, setAccounts] = useState<IOption[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const rawAccounts = await fetch("/api/account");
      setAccountsRaw(await rawAccounts.json());
    };
    fetchAccounts();
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

    onSubmit(newExpenseData);
  };

  return accountsRaw === null ? (
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
            isCurrency
            isRequired
            value={Number.isNaN(amount) ? "" : amount}
          >
            Amount
          </Input>
          <Input
            id="date"
            type="date"
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
      </Form>
    </>
  );
};

export default ExpenseForm;
