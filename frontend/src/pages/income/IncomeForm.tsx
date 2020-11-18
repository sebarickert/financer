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
  toAccount?: string;
  onSubmit(account: IExpense): void;
  submitLabel: string;
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
}: IProps): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [accounts, setAccounts] = useState<IOption[] | null>(null);

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
      toAccount: newToAccount,
    } = event.target;
    const newIncomeData: IIncome = {
      toAccount: newToAccount.value,
      amount: parseFloat((newAmount.value as string).replace(",", ".")),
      description: newDescription.value,
      date: newDate.value,
    };

    onSubmit(newIncomeData);
  };

  return accounts === null ? (
    <Loader loaderColor="green" />
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
        accentColor="green"
      >
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <Input
            id="description"
            help="Description of the income, e.g. salary."
            isRequired
            value={description}
          >
            Description
          </Input>
          <Input
            id="amount"
            help="Amount of the income."
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
            Date of the income
          </Input>
          <Select
            id="toAccount"
            options={accounts}
            defaultValue={toAccount}
            isRequired
          >
            Account where the income was received on
          </Select>
        </div>
      </Form>
    </>
  );
};

export default IncomeForm;
