import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { handleAccountEdit } from '@/actions/account/handleAccountEdit';
import { getAccountById } from '@/api-service';
import { AccountForm } from '@/features/account/AccountForm';
import { ContentHeader } from '@/layouts/ContentHeader';

type Params = Promise<{
  accountId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { accountId } = await params;
  const account = await getAccountById(accountId);

  return {
    title: `Edit ${account?.name}`,
  };
};

export default async function AccountEditPage({ params }: { params: Params }) {
  const { accountId } = await params;

  const account = await getAccountById(accountId);

  if (!account) {
    notFound();
  }

  const handleSubmit = handleAccountEdit.bind(null, account);

  return (
    <>
      <ContentHeader
        title={`Edit ${account.name}`}
        breadcrumbOverrides={{
          [`/accounts/${accountId}`]: account.name,
        }}
      />

      <AccountForm
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        initialValues={account}
      />
    </>
  );
}
