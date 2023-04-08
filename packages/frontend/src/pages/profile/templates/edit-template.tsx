import { useState, useMemo } from 'react';

import { TemplateForm } from './template-form';

import {
  TransactionTemplateDto,
  UpdateTransactionTemplateDto,
} from '$api/generated/financerApi';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories-form/transaction-categories-form';
import { Button } from '$elements/button/button';
import { DialogConfirm } from '$elements/dialog/confirm/dialog.confirm';
import { Dialog } from '$elements/dialog/dialog';
import { IconName } from '$elements/icon/icon';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface TemplateDeleteModalProps {
  handleDelete: () => void;
}

const TemplateDeleteModal = ({ handleDelete }: TemplateDeleteModalProps) => {
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

export type UpdateTransactionTemplateDtoWithCategory = Omit<
  UpdateTransactionTemplateDto,
  'categories'
> & {
  categories?: TransactionCategoriesFormFields[];
};

interface EditTemplateProps {
  isLoading: boolean;
  errors: string[];
  template: TransactionTemplateDto;
  onSubmit: (data: UpdateTransactionTemplateDtoWithCategory) => void;
  onDelete: () => void;
}

export const EditTemplate = ({
  isLoading,
  errors,
  template,
  onSubmit,
  onDelete,
}: EditTemplateProps): JSX.Element => {
  const initialValues = useMemo(
    () => ({
      ...template,
      categories: template?.categories?.map((categoryId) => ({
        category_id: categoryId,
        amount: NaN,
      })),
    }),
    [template]
  );

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Edit template"
        backLink="/profile/transaction-templates"
      />
      <TemplateForm
        onSubmit={onSubmit}
        errors={errors}
        submitLabel="Update"
        initialValues={initialValues}
        optionalFooterComponent={
          <TemplateDeleteModal handleDelete={onDelete} />
        }
      />
    </>
  );
};
