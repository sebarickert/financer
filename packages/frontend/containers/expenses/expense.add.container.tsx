import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { ExpenseDto, TransactionType } from '$api/generated/financerApi';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$blocks/transaction-categories/transaction-categories.types';
import { TransactionForm } from '$blocks/transaction-form/transaction-form';
import { TransactionTemplateSwitcher } from '$blocks/TransactionTemplateSwitcher';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { ExpenseService } from '$ssr/api/expense.service ';
import { TransactionTemplateService } from '$ssr/api/transaction-template.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

interface ExpenseAddContainerProps {
  templateId?: string;
}

export const ExpenseAddContainer: FC<ExpenseAddContainerProps> = async ({
  templateId,
}) => {
  const defaultExpenseAccount =
    await UserPreferenceService.getDefaultExpenseAccount();

  const transactionTemplate = !!templateId
    ? await TransactionTemplateService.getById(templateId)
    : undefined;

  const handleSubmit: DefaultFormActionHandler = async (
    prevState,
    formData,
  ) => {
    'use server';

    const categories = parseArrayFromFormData(
      formData,
      'categories',
      isCategoriesFormFullFields,
      parseCategoriesFormFullFields,
    );

    let data: ExpenseDto;

    try {
      data = await ExpenseService.add({
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        fromAccount: formData.get('fromAccount') as string,
        categories: categories,
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        return { status: 'ERROR', errors: error.errors };
      }

      console.error(error);
      return { status: 'ERROR', errors: ['Something went wrong'] };
    }

    redirect(`/statistics/expenses/${data.id}`, RedirectType.push);
  };

  const initialValues = !transactionTemplate
    ? {
        fromAccount: defaultExpenseAccount,
      }
    : {
        ...transactionTemplate,
        fromAccount: transactionTemplate.fromAccount ?? undefined,
        toAccount: undefined,
        categories: transactionTemplate.categories?.map((categoryId) => ({
          categoryId,
          amount: NaN,
        })),
      };

  return (
    <>
      <UpdatePageInfo
        headerAction={
          <TransactionTemplateSwitcher
            selectedTemplate={templateId}
            templateType={TransactionType.Expense}
          />
        }
      />
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasFromAccountField
      />
    </>
  );
};
