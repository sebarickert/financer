import {
  CreateTransactionCategoryDto,
  CreateTransactionTemplateDto,
} from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useAddTransactionCategory } from '../../../hooks/transactionCategories/useAddTransactionCategory';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

import { ShortcutForm } from './ShortcutForm';

export const AddShortcut = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransactionCategory = useAddTransactionCategory();

  const handleSubmit = async (
    newShortcutData: CreateTransactionTemplateDto
  ) => {
    console.log(newShortcutData);

    // try {
    //   const newExpenseJson = await addTransactionCategory(newShortcutData);

    //   if ('message' in newExpenseJson) {
    //     setErrors(parseErrorMessagesToArray(newExpenseJson.message));
    //     return;
    //   }

    //   navigate('/profile/transaction-categories');
    // } catch (error) {
    //   // eslint-disable-next-line no-console
    //   console.log(error);
    // }
  };

  return (
    <>
      <UpdatePageInfo title="Add shortcut" backLink="/profile/shortcuts" />
      <ShortcutForm
        //onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Add"
      />
    </>
  );
};
