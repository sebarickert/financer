import { IAccount } from '@local/types';

import { Alert } from '../../components/alert/alert';
import { Form } from '../../components/form/form';
import { Input } from '../../components/input/input';
import { Select, IOption } from '../../components/select/select';

interface IAccountFormProps {
  errors: string[];
  name?: string;
  balance?: number;
  type?: string;
  onSubmit(account: IAccount): void;
  submitLabel: string;
}

export const AccountForm = ({
  errors,
  name = '',
  balance = NaN,
  type = 'savings',
  onSubmit,
  submitLabel,
}: IAccountFormProps): JSX.Element => {
  const accountTypes: IOption[] = [
    {
      value: 'cash',
      label: 'Cash',
    },
    {
      value: 'savings',
      label: 'Savings',
    },
    {
      value: 'investment',
      label: 'Investment',
    },
    {
      value: 'credit',
      label: 'Credit',
    },
    {
      value: 'loan',
      label: 'Loan',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { account, amount, type: newType } = event.target;
    const newAccountData: IAccount = {
      balance: parseFloat((amount.value as string).replace(',', '.')),
      name: account.value,
      type: newType.value,
    };

    onSubmit(newAccountData);
  };

  return (
    <>
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="form-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        submitLabel={submitLabel}
        handleSubmit={handleSubmit}
        accentColor="blue"
        formFooterBackLink="/accounts"
      >
        <section>
          <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input id="account" isRequired value={name}>
              Account
            </Input>
            <Input
              id="amount"
              type="number"
              step={0.01}
              isCurrency
              isRequired
              value={Number.isNaN(balance) ? '' : balance}
            >
              Balance
            </Input>
            <Select
              id="type"
              options={accountTypes}
              defaultValue={type}
              isRequired
            >
              Type
            </Select>
          </div>
        </section>
      </Form>
    </>
  );
};
