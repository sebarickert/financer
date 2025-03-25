import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { handleAccountEdit } from '@/actions/account/handleAccountEdit';
import { AccountForm } from '@/features/account/AccountForm';
import { ContentHeader } from '@/layouts/ContentHeader';
import { AccountService } from '@/ssr/api/AccountService';

type Params = Promise<{
  accountId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { accountId } = await params;
  const account = await AccountService.getById(accountId);

  return {
    title: `Edit ${account?.name}`,
  };
};

export default async function AccountEditPage({ params }: { params: Params }) {
  const { accountId } = await params;

  const account = await AccountService.getById(accountId);

  if (!account) {
    notFound();
  }

  const handleSubmit = handleAccountEdit.bind(null, account);

  return (
    <>
      <ContentHeader
        title="Edit Account"
        backLink={`/accounts/${account.id}`}
      />
      <AccountForm
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        initialValues={account}
      />
    </>
  );
}
