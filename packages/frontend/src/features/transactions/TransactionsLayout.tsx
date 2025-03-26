import { FC } from 'react';

import { RequireAccounts } from '@/components/RequireAccounts';
import { transactionsContextualNavigationItems } from '@/constants/transactionsContextualNavigationItems';
import { ContentHeader } from '@/layouts/ContentHeader';
import { LayoutProps } from '@/layouts/Layout';

type TransactionsLayoutProps = Omit<LayoutProps, 'contextualNavigationItems'>;

export const TransactionsLayout: FC<TransactionsLayoutProps> = ({
  children,
  ...rest
}) => {
  return (
    <>
      <ContentHeader
        {...rest}
        contextualNavigationItems={transactionsContextualNavigationItems}
      />
      <RequireAccounts>{children}</RequireAccounts>
    </>
  );
};
