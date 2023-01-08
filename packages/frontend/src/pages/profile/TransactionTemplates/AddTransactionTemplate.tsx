import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TransactionTemplateForm } from './TransactionTemplateForm';

import {
  CreateTransactionTemplateDto,
  useTransactionTemplatesCreateMutation,
} from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddTransactionTemplate = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransactionTemplate, { isLoading: isCreating }] =
    useTransactionTemplatesCreateMutation();

  const handleSubmit = async (
    newTransactionTemplateData: CreateTransactionTemplateDto
  ) => {
    try {
      const newTransactionTemplateJson = await addTransactionTemplate({
        createTransactionTemplateDto: newTransactionTemplateData,
      }).unwrap();

      if ('message' in newTransactionTemplateJson) {
        setErrors(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
      {isCreating && <LoaderFullScreen />}
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
