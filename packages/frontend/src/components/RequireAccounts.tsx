import { Grid2X2 } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { Button } from '@/elements/Button/Button';
import { AccountService } from '@/ssr/api/AccountService';

export const RequireAccounts: FC<{ children: ReactNode }> = async ({
  children,
}) => {
  const accounts = await AccountService.getAll();

  if (!accounts.length) {
    return (
      <InfoMessageBlock
        title="No Accounts Added"
        Icon={Grid2X2}
        action={<Button href="/accounts/add">Add Account</Button>}
      >
        It seems you haven&apos;t added any accounts yet. Get started by adding
        your first account to begin organizing and tracking your finances.
      </InfoMessageBlock>
    );
  }

  return children;
};
