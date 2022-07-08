import { CreateTransactionTemplateDto } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useAddTransactionTemplate } from '../../../hooks/transactionTemplate/useAddTransactionTemplate';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

import { ShortcutForm } from './ShortcutForm';

export const AddShortcut = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionTemplate = useAddTransactionTemplate();

  const handleSubmit = async (
    newShortcutData: CreateTransactionTemplateDto
  ) => {
    try {
      const newTransactionTemplateJson = await addTransactionTemplate(
        newShortcutData
      );

      if ('message' in newTransactionTemplateJson) {
        setErrors(
          parseErrorMessagesToArray(newTransactionTemplateJson.message)
        );
        return;
      }

      navigate('/profile/shortcuts');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <UpdatePageInfo title="Add shortcut" backLink="/profile/shortcuts" />
      <ShortcutForm onSubmit={handleSubmit} errors={errors} submitLabel="Add" />
    </>
  );
};
