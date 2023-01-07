import { useNavigate } from 'react-router-dom';

import { useAccountsFindAllByUserQuery } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { Loader } from '$elements/loader/loader';
import { Select } from '$elements/select/select';
import { useUserDefaultExpenseAccount } from '$hooks/profile/user-preference/useUserDefaultExpenseAccount';
import { useUserDefaultIncomeAccount } from '$hooks/profile/user-preference/useUserDefaultIncomeAccount';
import { useUserDefaultTransferSourceAccount } from '$hooks/profile/user-preference/useUserDefaultTransferSourceAccount';
import { useUserDefaultTransferTargetAccount } from '$hooks/profile/user-preference/useUserDefaultTransferTargetAccount';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const UserDefaultAccountSettings = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: accounts, isLoading } = useAccountsFindAllByUserQuery({});

  const [defaultIncomeAccount, setDefaultIncomeAccount] =
    useUserDefaultIncomeAccount();
  const [defaultExpenseAccount, setDefaultExpenseAccount] =
    useUserDefaultExpenseAccount();
  const [defaultTransferSourceAccount, setDefaultTransferSourceAccount] =
    useUserDefaultTransferSourceAccount();
  const [defaultTransferTargetAccount, setDefaultTransferTargetAccount] =
    useUserDefaultTransferTargetAccount();

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      toAccountIncome: { value: toAccountIncomeValue },
      fromAccountExpense: { value: fromAccountExpenseValue },
      toAccountTransfer: { value: toAccountTransferValue },
      fromAccountTransfer: { value: fromAccountTransferValue },
    } = event.target as unknown as {
      toAccountIncome: HTMLSelectElement;
      fromAccountExpense: HTMLSelectElement;
      toAccountTransfer: HTMLSelectElement;
      fromAccountTransfer: HTMLSelectElement;
    };

    await Promise.all([
      setDefaultIncomeAccount(toAccountIncomeValue),
      setDefaultExpenseAccount(fromAccountExpenseValue),
      setDefaultTransferSourceAccount(fromAccountTransferValue),
      setDefaultTransferTargetAccount(toAccountTransferValue),
    ]);

    navigate('/profile/user-preferences');
  };

  return (
    <Loader isLoading={isLoading}>
      <UpdatePageInfo
        title="Default account settings"
        backLink={'/profile/user-preferences'}
      />
      <Form
        handleSubmit={handleSave}
        submitLabel="Save"
        formFooterBackLink="/profile/user-preferences"
      >
        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
          <Select
            id="toAccountIncome"
            options={
              accounts?.data.map(({ name, _id }) => ({
                label: name,
                value: _id,
              })) ?? []
            }
            defaultValue={defaultIncomeAccount}
            isRequired
          >
            Default income account
          </Select>
          <Select
            id="fromAccountExpense"
            options={
              accounts?.data.map(({ name, _id }) => ({
                label: name,
                value: _id,
              })) ?? []
            }
            defaultValue={defaultExpenseAccount}
            isRequired
          >
            Default expense account
          </Select>
          <Select
            id="fromAccountTransfer"
            options={
              accounts?.data.map(({ name, _id }) => ({
                label: name,
                value: _id,
              })) ?? []
            }
            defaultValue={defaultTransferSourceAccount}
            isRequired
          >
            Default transfer source account
          </Select>
          <Select
            id="toAccountTransfer"
            options={
              accounts?.data.map(({ name, _id }) => ({
                label: name,
                value: _id,
              })) ?? []
            }
            defaultValue={defaultTransferTargetAccount}
            isRequired
          >
            Default transfer target account
          </Select>
        </div>
      </Form>
    </Loader>
  );
};
