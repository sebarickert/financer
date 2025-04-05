import { Grid2X2 } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { getAllAccounts } from '@/api-service';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { Button } from '@/elements/Button/Button';

export const RequireAccounts: FC<{ children: ReactNode }> = async ({
  children,
}) => {
  const accounts = await getAllAccounts();

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
