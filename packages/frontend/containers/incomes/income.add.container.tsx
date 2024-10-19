import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { IncomeDto, TransactionType } from '$api/generated/financerApi';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$blocks/transaction-categories/transaction-categories.types';
import { TransactionForm } from '$blocks/transaction-form/transaction-form';
import { TransactionTemplateSwitcher } from '$blocks/TransactionTemplateSwitcher';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { IncomeService } from '$ssr/api/income.service';
import { TransactionTemplateService } from '$ssr/api/transaction-template.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

interface IncomeAddContainerProps {
  templateId?: string;
}

export const IncomeAddContainer: FC<IncomeAddContainerProps> = async ({
  templateId,
}) => {
  const defaultIncomeAccount =
    await UserPreferenceService.getDefaultIncomeAccount();

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

    let data: IncomeDto;

    try {
      data = await IncomeService.add({
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        toAccount: formData.get('toAccount') as string,
        categories: categories,
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        return { status: 'ERROR', errors: error.errors };
      }

      console.error(error);
      return { status: 'ERROR', errors: ['Something went wrong'] };
    }

    redirect(`/statistics/incomes/${data.id}`, RedirectType.push);
  };

  const initialValues = !transactionTemplate
    ? {
        fromAccount: defaultIncomeAccount,
      }
    : {
        ...transactionTemplate,
        fromAccount: undefined,
        toAccount: transactionTemplate.toAccount ?? undefined,
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
            templateType={TransactionType.Income}
          />
        }
      />
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
      />
    </>
  );
};
