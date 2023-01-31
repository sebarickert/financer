import { Form } from '../../components/blocks/form/form';
import { Alert } from '../../components/elements/alert/alert';
import { Input } from '../../components/elements/input/input';
import { Select, Option } from '../../components/elements/select/select';
import { capitalize } from '../../utils/capitalize';

import { AccountTypeEnum, CreateAccountDto } from '$api/generated/financerApi';

interface IAccountFormProps {
  errors: string[];
  name?: string;
  balance?: number;
  type?: string;
  onSubmit(account: CreateAccountDto): void;
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
  const accountTypes: Option[] = Object.values(AccountTypeEnum).map(
    (value) => ({
      value,
      label: capitalize(value),
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { account, amount, type: newType } = event.target;
    const newAccountData: CreateAccountDto = {
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
