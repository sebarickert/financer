import { Grid2X2 } from 'lucide-react';
import { FC } from 'react';

import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { transactionsContextualNavigationItems } from '@/constants/transactionsContextualNavigationItems';
import { Button } from '@/elements/Button/Button';
import { Layout, LayoutProps } from '@/layouts/Layout';
import { AccountService } from '@/ssr/api/AccountService';

type TransactionsLayoutProps = Omit<LayoutProps, 'contextualNavigationItems'>;

export const TransactionsLayout: FC<TransactionsLayoutProps> = async ({
  children,
  ...rest
}) => {
  const accounts = await AccountService.getAll();

  return (
    <Layout
      {...rest}
      contextualNavigationItems={transactionsContextualNavigationItems}
    >
      {!accounts.length && (
        <InfoMessageBlock
          title="No Accounts Added"
          Icon={Grid2X2}
          action={<Button href="/accounts/add">Add Account</Button>}
        >
          It seems you haven&apos;t added any accounts yet. Get started by
          adding your first account to begin organizing and tracking your
          finances.
        </InfoMessageBlock>
      )}
      {Boolean(accounts.length) && children}
    </Layout>
  );
};
