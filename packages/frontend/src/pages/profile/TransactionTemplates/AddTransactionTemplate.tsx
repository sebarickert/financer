import { CreateTransactionTemplateDto } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useAddTransactionTemplate } from '../../../hooks/transactionTemplate/useAddTransactionTemplate';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

import { TransactionTemplateForm } from './TransactionTemplateForm';

export const AddTransactionTemplate = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionTemplate = useAddTransactionTemplate();

  const handleSubmit = async (
    newTransactionTemplateData: CreateTransactionTemplateDto
  ) => {
    try {
      const newTransactionTemplateJson = await addTransactionTemplate(
        newTransactionTemplateData
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
      console.log(error);
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
