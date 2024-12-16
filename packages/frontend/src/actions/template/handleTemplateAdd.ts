'use server';

import { redirect, RedirectType } from 'next/navigation';

import {
  TransactionTemplateType,
  TransactionType,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isCategoriesFormOnlyCategory } from '$features/transaction/TransactionCategories/transaction-categories.types';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { TransactionTemplateService } from '$ssr/api/TransactionTemplateService';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

export const handleTemplateAdd: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  const dayOfMonth = formData.get('dayOfMonth');
  const dayOfMonthToCreate = formData.get('dayOfMonthToCreate');

  const categories = parseArrayFromFormData(
    formData,
    'categories',
    isCategoriesFormOnlyCategory,
  );

  try {
    await TransactionTemplateService.add({
      templateName: formData.get('templateName') as string,
      templateType: [
        formData.get('templateType') as unknown as TransactionTemplateType,
      ],
      templateVisibility: formData.get('templateVisibility') as TransactionType,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      fromAccount: formData.get('fromAccount') as string,
      toAccount: formData.get('toAccount') as string,
      dayOfMonth: dayOfMonth ? parseInt(dayOfMonth as string) : undefined,
      dayOfMonthToCreate: dayOfMonthToCreate
        ? parseInt(dayOfMonthToCreate as string)
        : undefined,
      categories: categories.map(({ categoryId }) => categoryId),
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return { status: 'ERROR', errors: error.errors };
    }

    console.error(error);
    return { status: 'ERROR', errors: ['Something went wrong'] };
  }

  redirect('/templates', RedirectType.push);
};
