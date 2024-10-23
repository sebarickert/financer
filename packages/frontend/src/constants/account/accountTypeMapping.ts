import { AccountType } from '$api/generated/financerApi';
import { IconName } from '$elements/Icon';

export const accountTypeIconMapping: { [key in AccountType]: IconName } = {
  [AccountType.Cash]: 'WalletIcon',
  [AccountType.Savings]: 'BanknotesIcon',
  [AccountType.Investment]: 'ArrowTrendingUpIcon',
  [AccountType.Credit]: 'CreditCardIcon',
  [AccountType.Loan]: 'BuildingLibraryIcon',
  [AccountType.LongTermSavings]: 'BanknotesIcon',
  [AccountType.PreAssignedCash]: 'LockClosedIcon',
};

export const accountTypeLabelMapping: { [key in AccountType]: string } = {
  [AccountType.Cash]: 'cash',
  [AccountType.Savings]: 'savings',
  [AccountType.Investment]: 'investment',
  [AccountType.Credit]: 'credit',
  [AccountType.Loan]: 'loan',
  [AccountType.LongTermSavings]: 'long-term savings',
  [AccountType.PreAssignedCash]: 'pre-assigned cash',
};
