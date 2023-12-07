import { useState } from 'react';

import { useTransactionTemplatesCreateMutation } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  TemplateAdd,
  CreateTransactionTemplateDtoWithCategory,
} from '$pages/settings/templates/template.add';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const TemplateAddContainer = () => {
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

      push(settingsPaths.templates);
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
    <TemplateAdd
      onSubmit={handleSubmit}
      errors={errors}
      isLoading={isCreating}
    />
  );
};
