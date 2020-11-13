import React from "react";
import { useHistory } from "react-router-dom";
import Form from "../../components/form/form";
import Input from "../../components/input/input";
import Select, { IOption } from "../../components/select/select";

const AddAccount = (): JSX.Element => {
  const history = useHistory();

  const accountTypes: IOption[] = [
    {
      value: "cash",
      label: "Cash",
    },
    {
      value: "savings",
      label: "Savings",
      selected: true,
    },
    {
      value: "investment",
      label: "Investment",
    },
    {
      value: "credit",
      label: "Credit",
    },
  ];

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { account, amount, type } = event.target;
    const newAccountData: IAccount = {
      balance: parseFloat(amount.value),
      name: account.value,
      type: type.value,
    };

    try {
      const newAccount = await fetch("/api/account", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccountData),
      });
      history.push("/accounts");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      submitLabel="Add"
      formHeading="Add account"
      handleSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <Input
          id="account"
          help="Name of account, e.g. bank account."
          isRequired
        >
          Account
        </Input>
        <Input
          id="amount"
          help="Amount of savings in the account."
          isCurrency
          isRequired
        >
          Amount
        </Input>
        <Select id="type" options={accountTypes} isRequired>
          Account type
        </Select>
      </div>
    </Form>
  );
};

export default AddAccount;
