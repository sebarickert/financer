import { useState } from 'react';

import {
  useTransactionTemplatesUpdateMutation,
  useTransactionTemplatesRemoveMutation,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  EditTemplate,
  UpdateTransactionTemplateDtoWithCategory,
} from '$pages/profile/templates/edit-template';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface EditTemplateContainerProps {
  id: string;
}

export const EditTemplateContainer = ({ id }: EditTemplateContainerProps) => {
  const { push } = useViewTransitionRouter();

  const [errors, setErrors] = useState<string[]>([]);
  const [editTransactionTemplate, { isLoading: isSaving }] =
    useTransactionTemplatesUpdateMutation();
  const [deleteTransactionTemplate, { isLoading: isDeleting }] =
    useTransactionTemplatesRemoveMutation();
  const templateData = useTransactionTemplatesFindOneQuery({ id });
  const { data: template } = templateData;

  const handleSubmit = async (
    newTransactionTemplateData: UpdateTransactionTemplateDtoWithCategory
  ) => {
    if (!template?._id) {
      console.error('transactionTemplate is not defined');
      return;
    }

    const data = {
      ...newTransactionTemplateData,
      categories: newTransactionTemplateData.categories?.map(
        ({ category_id }) => category_id
      ),
    };

    try {
      await editTransactionTemplate({
        id: template._id,
        updateTransactionTemplateDto: data,
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

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete template: no id');
      return;
    }
    deleteTransactionTemplate({ id });
    push('/profile/templates');
  };
  return (
    <>
      <DataHandler {...templateData} />
      {template && (
        <EditTemplate
          isLoading={isSaving || isDeleting}
          errors={errors}
          template={template}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
