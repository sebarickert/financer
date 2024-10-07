import { notFound, redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import {
  TransactionTemplateType,
  TransactionType,
} from '$api/generated/financerApi';
import { isCategoriesFormOnlyCategory } from '$blocks/transaction-categories/transaction-categories.types';
import { settingsPaths } from '$constants/settings-paths';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { TransactionTemplateService } from '$ssr/api/transaction-template.service';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';
import { TemplateEdit } from '$views/settings/templates/template.edit';

interface TemplateEditContainerProps {
  id: string;
}

export const TemplateEditContainer: FC<TemplateEditContainerProps> = async ({
  id,
}) => {
  const template = await TransactionTemplateService.getById(id);

  if (!template) {
    notFound();
  }

  const handleSubmit: DefaultFormActionHandler = async (prev, formData) => {
    'use server';

    const dayOfMonth = formData.get('dayOfMonth');
    const dayOfMonthToCreate = formData.get('dayOfMonthToCreate');

    const categories = parseArrayFromFormData(
      formData,
      'categories',
      isCategoriesFormOnlyCategory,
    );

    try {
      await TransactionTemplateService.update(template?.id, {
        templateName: formData.get('templateName') as string,
        templateType: [
          formData.get('templateType') as unknown as TransactionTemplateType,
        ],
        templateVisibility: formData.get(
          'templateVisibility',
        ) as TransactionType,
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

    redirect(settingsPaths.templates, RedirectType.push);
  };

  const handleDelete = async () => {
    'use server';

    if (!id) {
      console.error('Failed to delete template: no id');
      return;
    }
    await TransactionTemplateService.delete(id);

    redirect(settingsPaths.templates, RedirectType.push);
  };

  return (
    <TemplateEdit
      template={template}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
};
