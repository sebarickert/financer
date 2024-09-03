import { Metadata } from 'next';
import { FC } from 'react';

import { TransferAddContainer } from '$container/transfers/transfer.add.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Add Transfer',
};

type AddTransferWithTemplateIdPageProps = {
  params: {
    templateId: string;
  };
};

const AddTransferWithTemplateIdPage: FC<AddTransferWithTemplateIdPageProps> = ({
  params: { templateId },
}) => {
  return (
    <Layout title="Add Transfer">
      <TransferAddContainer templateId={templateId} />
    </Layout>
  );
};

export default AddTransferWithTemplateIdPage;
