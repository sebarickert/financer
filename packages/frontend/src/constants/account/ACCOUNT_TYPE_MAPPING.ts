import {
  Banknote,
  ChartNoAxesCombined,
  ClipboardCheck,
  CreditCard,
  Landmark,
  LucideIcon,
  PiggyBank,
  Wallet,
} from 'lucide-react';

import { AccountType } from '$api/generated/financerApi';

export const ACCOUNT_TYPE_MAPPING: Record<
  AccountType,
  { Icon: LucideIcon; label: string; description: string }
> = {
  [AccountType.Savings]: {
    Icon: Wallet,
    label: 'Savings',
    description: 'Funds set aside for short-term goals or unexpected expenses.',
  },
  [AccountType.LongTermSavings]: {
    Icon: PiggyBank,
    label: 'Long-term Savings',
    description:
      'Money reserved for future needs, such as retirement or major purchases.',
  },
  [AccountType.Cash]: {
    Icon: Banknote,
    label: 'Cash',
    description:
      'Cash on hand, easily accessible for daily transactions and expenses.',
  },
  [AccountType.PreAssignedCash]: {
    Icon: ClipboardCheck,
    label: 'Pre-assigned Cash',
    description: 'Money allocated for specific expenses or budgets in advance.',
  },
  [AccountType.Credit]: {
    Icon: CreditCard,
    label: 'Credit',
    description:
      'Borrowed funds with a repayment obligation, like credit card balances.',
  },
  [AccountType.Investment]: {
    Icon: ChartNoAxesCombined,
    label: 'Investment',
    description:
      'Assets allocated to stocks, bonds, or other ventures for growth potential.',
  },
  [AccountType.Loan]: {
    Icon: Landmark,
    label: 'Loan',
    description:
      'Debt obtained for specific purposes, to be repaid over time with interest.',
  },
};
