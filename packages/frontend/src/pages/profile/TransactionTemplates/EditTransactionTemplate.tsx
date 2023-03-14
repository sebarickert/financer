import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TransactionTemplateForm } from './TransactionTemplateForm';

import {
  UpdateTransactionTemplateDto,
  useTransactionTemplatesFindOneQuery,
  useTransactionTemplatesRemoveMutation,
  useTransactionTemplatesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories-form/transaction-categories-form';
import { Button } from '$elements/button/button';
import { DialogConfirm } from '$elements/dialog/confirm/dialog.confirm';
import { Dialog } from '$elements/dialog/dialog';
import { IconName } from '$elements/icon/icon';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface TransactionTemplateDeleteModalProps {
  handleDelete(): void;
}

const TransactionTemplateDeleteModal = ({
  handleDelete,
}: TransactionTemplateDeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Delete</Button>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirm
          label="Delete template"
          onConfirm={handleDelete}
          onCancel={() => setIsOpen(!isOpen)}
          submitButtonLabel="Delete"
          iconName={IconName.exclamation}
        >
          Are you sure you want to delete this template? All of your data will
          be permanently removed. This action cannot be undone.
        </DialogConfirm>
      </Dialog>
    </>
  );
};

type UpdateTransactionTemplateDtoWithCategory = Omit<
  UpdateTransactionTemplateDto,
  'categories'
> & {
  categories?: TransactionCategoriesFormFields[];
};

export const EditTransactionTemplate = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id-not-found' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const [editTransactionTemplate, { isLoading: isSaving }] =
    useTransactionTemplatesUpdateMutation();
  const [deleteTransactionTemplate, { isLoading: isDeleting }] =
    useTransactionTemplatesRemoveMutation();
  const templateData = useTransactionTemplatesFindOneQuery({ id });
  const { data: transactionTemplate } = templateData;

  const handleSubmit = async (
    newTransactionTemplateData: UpdateTransactionTemplateDtoWithCategory
  ) => {
    if (!transactionTemplate?._id) {
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
        id: transactionTemplate._id,
        updateTransactionTemplateDto: data,
      }).unwrap();

      navigate('/profile/transaction-templates');
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
    navigate('/profile/templates');
  };

  const initialValues = {
    ...transactionTemplate,
    categories: transactionTemplate?.categories?.map((categoryId) => ({
      category_id: categoryId,
      amount: NaN,
    })),
  };

  return (
    <>
      {(isSaving || isDeleting) && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Edit template"
        backLink="/profile/transaction-templates"
      />
      <DataHandler {...templateData} />
      {transactionTemplate && (
        <TransactionTemplateForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Update"
          initialValues={initialValues}
          optionalFooterComponent={
            <TransactionTemplateDeleteModal handleDelete={handleDelete} />
          }
        />
      )}
    </>
  );
};
