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
    newTransactionTemplateData: UpdateTransactionTemplateDto
  ) => {
    if (!transactionTemplate?._id) {
      console.error('transactionTemplate is not defined');
      return;
    }

    try {
      const newTransactionTemplateJson = await editTransactionTemplate({
        id: transactionTemplate._id,
        updateTransactionTemplateDto: newTransactionTemplateData,
      });

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

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete template: no id');
      return;
    }
    deleteTransactionTemplate({ id });
    navigate('/profile/templates');
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
          amount={transactionTemplate.amount ?? undefined}
          dayOfMonth={transactionTemplate.dayOfMonth ?? undefined}
          dayOfMonthToCreate={
            transactionTemplate.dayOfMonthToCreate ?? undefined
          }
          description={transactionTemplate.description ?? undefined}
          fromAccount={transactionTemplate.fromAccount ?? undefined}
          toAccount={transactionTemplate.toAccount ?? undefined}
          templateName={transactionTemplate.templateName ?? undefined}
          templateType={transactionTemplate.templateType[0] as string}
          transactionType={transactionTemplate.templateVisibility}
          transactionCategoryMapping={transactionTemplate.categories?.map(
            (category) => ({
              category_id: category,
            })
          )}
          optionalFooterComponent={
            <TransactionTemplateDeleteModal handleDelete={handleDelete} />
          }
        />
      )}
    </>
  );
};
