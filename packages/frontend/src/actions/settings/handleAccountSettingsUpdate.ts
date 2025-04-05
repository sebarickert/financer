import { RedirectType, redirect } from 'next/navigation';

import {
  updateDefaultExpenseAccount,
  updateDefaultIncomeAccount,
  updateDefaultTransferSourceAccount,
  updateDefaultTransferTargetAccount,
} from '@/api-service';
import { settingsPaths } from '@/constants/settingsPaths';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';

export const handleAccountSettingsUpdate: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  'use server';

  await Promise.all([
    updateDefaultIncomeAccount(formData.get('toAccountIncome') as string),
    updateDefaultExpenseAccount(formData.get('fromAccountExpense') as string),
    updateDefaultTransferSourceAccount(
      formData.get('fromAccountTransfer') as string,
    ),
    updateDefaultTransferTargetAccount(
      formData.get('toAccountTransfer') as string,
    ),
  ]);

  redirect(settingsPaths.default, RedirectType.push);
};
