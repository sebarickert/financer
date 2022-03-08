import { Heading } from '../../../components/heading/heading';
import { QuickLinks } from '../../../components/quick-links/quick-links';
import { SEO } from '../../../components/seo/seo';

import { UserDefaultExpenseAccount } from './preferences/UserDefaultExpenseAccount';
import { UserDefaultIncomeAccount } from './preferences/UserDefaultIncomeAccount';
import { UserDefaultTransferSourceAccount } from './preferences/UserDefaultTransferSourceAccount';
import { UserDefaultTransferTargetAccount } from './preferences/UserDefaultTransferTargetAccount';
import { UserTransactionListChunkSize } from './preferences/UserTransactionListChunkSize';

export const UserPreferences = (): JSX.Element => {
  return (
    <>
      <SEO title="User preferences" />
      <Heading variant="h1" className="mb-6">
        User preferences
      </Heading>
      <QuickLinks>
        <UserDefaultIncomeAccount />
        <UserDefaultExpenseAccount />
        <UserDefaultTransferSourceAccount />
        <UserDefaultTransferTargetAccount />
        <UserTransactionListChunkSize />
      </QuickLinks>
    </>
  );
};
