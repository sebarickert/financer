import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TransactionTemplateForm } from './TransactionTemplateForm';

import { CreateTransactionTemplateDto } from '$api/generated/financerApi';
import { useAddTransactionTemplate } from '$hooks/transactionTemplate/useAddTransactionTemplate';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddTransactionTemplate = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionTemplate = useAddTransactionTemplate();

  const handleSubmit = async (
    newTransactionTemplateData: CreateTransactionTemplateDto
  ) => {
    try {
      const newTransactionTemplateJson = await addTransactionTemplate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newTransactionTemplateData as any
      );

      if ('message' in newTransactionTemplateJson) {
        setErrors(
          parseErrorMessagesToArray(newTransactionTemplateJson.message)
        );
        return;
      }

      navigate('/profile/transaction-templates');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      <UpdatePageInfo
        title="Add template"
        backLink="/profile/transaction-templates"
      />
      <TransactionTemplateForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Add"
      />
    </>
  );
};
