import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "../../components/form/form";
import Input from "../../components/input/input";
import Select, { IOption } from "../../components/select/select";
import Alert from "../../components/alert/alert";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";

const AccountTransfer = (): JSX.Element => {
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);
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

    try {
      const newTransaction = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransferData),
      });

      const newAccountJson = await newTransaction.json();

      if (newAccountJson.status === 201) {
        history.push("/accounts");
      } else if (newAccountJson.status === 400) {
        setErrors(newAccountJson.errors);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return accounts === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
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
          <Input id="date" type="date" isDate>
            Date of the transfer
          </Input>
          <Select id="fromAccount" options={accounts} isRequired>
            The account from which the money is taken
          </Select>
          <Select id="toAccount" options={accounts} isRequired>
            The account to which the money will be added
          </Select>
        </div>
      </Form>
    </>
  );
};

export default AccountTransfer;
