import {
  TransactionCategoryMappingDto,
  UpdateTransactionTemplateDto,
} from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ModalConfirm } from '../../../components/modal/confirm/modal.confirm';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { useDeleteTransactionTemplate } from '../../../hooks/transactionTemplate/useDeleteTransactionTemplate';
import { useEditTransactionTemplate } from '../../../hooks/transactionTemplate/useEditTransactionTemplate';
import { useTransactionTemplateById } from '../../../hooks/transactionTemplate/useTransactionTemplateById';
import { parseErrorMessagesToArray } from '../../../utils/apiHelper';

import { ShortcutForm } from './ShortcutForm';

interface ShortcutDeleteModalProps {
  handleDelete(): void;
}

const ShortcutDeleteModal = ({ handleDelete }: ShortcutDeleteModalProps) => (
  <ModalConfirm
    label="Delete shortcut"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete shortcut"
    accentColor="red"
    testId="delete-shortcut-modal"
  >
    Are you sure you want to delete this shortcut? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const EditShortcut = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const editTransactionTemplate = useEditTransactionTemplate();
  const deleteTransactionTemplate = useDeleteTransactionTemplate();
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

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete shortcut: no id');
      return;
    }
    deleteTransactionTemplate(id);
    navigate('/profile/shortcuts');
  };

  return (
    <>
      <UpdatePageInfo title="Edit shortcut" backLink="/profile/shortcuts" />
      <ShortcutForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Update"
        amount={transactionTemplate.amount ?? undefined}
        dayOfMonth={transactionTemplate.dayOfMonth ?? undefined}
        description={transactionTemplate.description ?? undefined}
        fromAccount={transactionTemplate.fromAccount ?? undefined}
        toAccount={transactionTemplate.toAccount ?? undefined}
        shortcutName={transactionTemplate.templateName ?? undefined}
        shortcutType={transactionTemplate.templateType[0] as string}
        transactionType={transactionTemplate.templateVisibility}
        transactionCategoryMapping={
          transactionTemplate.categories?.map((category) => ({
            category_id: category,
          })) as TransactionCategoryMappingDto[]
        }
        optionalFooterComponent={
          <ShortcutDeleteModal handleDelete={handleDelete} />
        }
      />
    </>
  );
};
