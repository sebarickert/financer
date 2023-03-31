import { useRouter } from 'next/router';
import { useState } from 'react';

import { TransactionTemplateForm } from './TransactionTemplateForm';

import {
  CreateTransactionTemplateDto,
  useTransactionTemplatesCreateMutation,
} from '$api/generated/financerApi';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories-form/transaction-categories-form';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

type CreateTransactionTemplateDtoWithCategory = Omit<
  CreateTransactionTemplateDto,
  'categories'
> & {
  categories: TransactionCategoriesFormFields[];
};

export const AddTransactionTemplate = (): JSX.Element | null => {
  const { push } = useRouter();
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
