import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { TransactionType, TransferDto } from '$api/generated/financerApi';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$blocks/transaction-categories/transaction-categories.types';
import { TransactionForm } from '$blocks/TransactionForm';
import { TransactionTemplateSwitcher } from '$blocks/TransactionTemplateSwitcher';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { TransactionTemplateService } from '$ssr/api/transaction-template.service';
import { TransferService } from '$ssr/api/transfer.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

interface TransferAddContainerProps {
  templateId?: string;
}

export const TransferAddContainer: FC<TransferAddContainerProps> = async ({
  templateId,
}) => {
  const defaultTransferSourceAccount =
    await UserPreferenceService.getDefaultTransferSourceAccount();
  const defaultTransferTargetAccount =
    await UserPreferenceService.getDefaultTransferTargetAccount();

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

    let data: TransferDto;

    try {
      data = await TransferService.add({
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        toAccount: formData.get('toAccount') as string,
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

    redirect(`/statistics/transfers/${data.id}`, RedirectType.push);
  };

  const initialValues = !transactionTemplate
    ? {
        fromAccount: defaultTransferSourceAccount,
        toAccount: defaultTransferTargetAccount,
      }
    : {
        ...transactionTemplate,
        fromAccount: transactionTemplate.fromAccount ?? undefined,
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
            templateType={TransactionType.Transfer}
          />
        }
      />
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
        hasFromAccountField
      />
    </>
  );
};
