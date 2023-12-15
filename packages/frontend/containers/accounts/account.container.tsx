import { useAccountsFindOneByIdQuery } from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { Account } from '$pages/accounts/account';

interface AccountContainerProps {
  id: string;
}

export const AccountContainer = ({ id }: AccountContainerProps) => {
  const data = useAccountsFindOneByIdQuery({ id });
  const account = data.data;

  return (
    <>
      <DataHandler {...data} />
      {account && <Account account={account} />}
    </>
  );
};
