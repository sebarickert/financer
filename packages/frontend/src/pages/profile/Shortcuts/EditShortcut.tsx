import {
  TransactionCategoryMappingDto,
  UpdateTransactionTemplateDto,
} from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useEditTransactionTemplate } from '../../../hooks/transactionTemplate/useEditTransactionTemplate';
import { useTransactionTemplateById } from '../../../hooks/transactionTemplate/useTransactionTemplateById';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

import { ShortcutForm } from './ShortcutForm';

export const EditShortcut = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const editTransactionTemplate = useEditTransactionTemplate();
  const transactionTemplate = useTransactionTemplateById(id);

  const handleSubmit = async (
    newShortcutData: UpdateTransactionTemplateDto
  ) => {
    if (!transactionTemplate?._id) {
      console.error('transactionTemplate is not defined');
      return;
    }

    try {
      const newTransactionTemplateJson = await editTransactionTemplate(
        transactionTemplate._id,
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
      <UpdatePageInfo title="Edit shortcut" backLink="/profile/shortcuts" />
      <ShortcutForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Update"
        amount={transactionTemplate.amount}
        dayOfMonth={transactionTemplate.dayOfMonth}
        description={transactionTemplate.description ?? ''}
        fromAccount={transactionTemplate.fromAccount}
        toAccount={transactionTemplate.toAccount}
        shortcutName={transactionTemplate.templateName}
        shortcutType={transactionTemplate.templateType[0] as string}
        transactionType={transactionTemplate.templateVisibility}
        transactionCategoryMapping={
          transactionTemplate.categories?.map((category) => ({
            category_id: category,
          })) as TransactionCategoryMappingDto[]
        }
      />
    </>
  );
};
