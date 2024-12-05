import {
  Banknote,
  ChartNoAxesCombined,
  CreditCard,
  Landmark,
  Lock,
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
    description:
      'Your main bank account, where most of your everyday transactions occur.',
  },
  [AccountType.LongTermSavings]: {
    Icon: PiggyBank,
    label: 'Long-term Savings',
    description:
      'A separate savings account, typically offering a higher interest rate for funds saved over a longer period.',
  },
  [AccountType.Cash]: {
    Icon: Banknote,
    label: 'Cash',
    description:
      'Physical money you have on hand, not stored in a bank account or digital form.',
  },
  [AccountType.PreAssignedCash]: {
    Icon: Lock,
    label: 'Pre-assigned Cash',
    description: 'Money set aside in advance for specific expenses.',
  },
  [AccountType.Credit]: {
    Icon: CreditCard,
    label: 'Credit',
    description:
      'A basic credit card account, used for borrowing money that must be repaid later.',
  },
  [AccountType.Investment]: {
    Icon: ChartNoAxesCombined,
    label: 'Investment',
    description:
      'Money invested in assets like stocks, bonds, or other ventures, aimed at growing your wealth over time.',
  },
  [AccountType.Loan]: {
    Icon: Landmark,
    label: 'Loan',
    description:
      'A loan for larger debts, such as a mortgage or other major financing obligations.',
  },
};
