import { useState } from 'react';

import { useTransactionTemplatesCreateMutation } from '$api/generated/financerApi';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  AddTemplate,
  CreateTransactionTemplateDtoWithCategory,
} from '$pages/profile/templates/add-template';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddTemplateContainer = () => {
  const { push } = useViewTransitionRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransactionTemplate, { isLoading: isCreating }] =
    useTransactionTemplatesCreateMutation();

  const handleSubmit = async (
    newTransactionTemplateData: CreateTransactionTemplateDtoWithCategory
  ) => {
    const data = {
      ...newTransactionTemplateData,
      categories: newTransactionTemplateData.categories?.map(
        ({ category_id }) => category_id
      ),
    };

    try {
      await addTransactionTemplate({
        createTransactionTemplateDto: data,
      }).unwrap();

      push('/profile/transaction-templates');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        setErrors(parseErrorMessagesToArray(error?.data?.message));
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <AddTemplate
      onSubmit={handleSubmit}
      errors={errors}
      isLoading={isCreating}
    />
  );
};
