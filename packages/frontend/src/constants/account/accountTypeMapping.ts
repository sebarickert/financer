import { AccountType } from '$api/generated/financerApi';
import { IconName } from '$elements/Icon';

export const accountTypeMapping: Record<
  AccountType,
  { icon: IconName; label: string; description: string }
> = {
  [AccountType.Savings]: {
    icon: 'BanknotesIcon',
    label: 'Savings',
    description: 'Funds set aside for short-term goals or unexpected expenses.',
  },
  [AccountType.LongTermSavings]: {
    icon: 'BanknotesIcon',
    label: 'Long-term Savings',
    description:
      'Money reserved for future needs, such as retirement or major purchases.',
  },
  [AccountType.Cash]: {
    icon: 'WalletIcon',
    label: 'Cash',
    description: 'Physical money on hand for daily transactions.',
  },
  [AccountType.PreAssignedCash]: {
    icon: 'LockClosedIcon',
    label: 'Pre-assigned Cash',
    description: 'Money allocated for specific expenses or budgets in advance.',
  },
  [AccountType.Credit]: {
    icon: 'CreditCardIcon',
    label: 'Credit',
    description:
      'Borrowed funds with a repayment obligation, like credit card balances.',
  },
  [AccountType.Investment]: {
    icon: 'ArrowTrendingUpIcon',
    label: 'Investment',
    description:
      'Assets allocated to stocks, bonds, or other ventures for growth potential.',
  },
  [AccountType.Loan]: {
    icon: 'BuildingLibraryIcon',
    label: 'Loan',
    description:
      'Debt obtained for specific purposes, to be repaid over time with interest.',
  },
};
