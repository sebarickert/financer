import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  TransactionCategoryMappingDto,
  useAccountsFindOneByIdQuery,
  useIncomesFindOneQuery,
  useIncomesRemoveMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { DialogConfirm } from '$elements/dialog/confirm/dialog.confirm';
import { Dialog } from '$elements/dialog/dialog';
import { Divider } from '$elements/divider/divider';
import { IconName } from '$elements/icon/icon';
import { InfoCard } from '$elements/info-card/info-card';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { formatCurrency } from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';

interface IIncomeDeleteModalProps {
  handleDelete(): void;
}

const IncomeDeleteModal = ({ handleDelete }: IIncomeDeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        testId="income-delete-modal_open-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Delete
      </Button>
      <Dialog isDialogOpen={isOpen} setIsDialogOpen={setIsOpen}>
        <DialogConfirm
          label="Delete income"
          onConfirm={handleDelete}
          onCancel={() => setIsOpen(!isOpen)}
          submitButtonLabel="Delete"
          iconName={IconName.exclamation}
          testId="income-delete-modal"
        >
          Are you sure you want to delete your income? All of your data will be
          permanently removed. This action cannot be undone.
        </DialogConfirm>
      </Dialog>
    </>
  );
};

export const Income = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'missing-id' } = useParams<{ id: string }>();
  const incomeData = useIncomesFindOneQuery({ id });
  const { data: income } = incomeData;

  const accountData = useAccountsFindOneByIdQuery(
    { id: income?.toAccount as string },
    { skip: !income?.toAccount }
  );
  const account = accountData.data;

  const { data: transactionCategories } =
    useAllTransactionCategoriesWithCategoryTree();
  const [deleteIncome, { isLoading: isDeleting }] = useIncomesRemoveMutation();

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete income: no id');
      return;
    }
    await deleteIncome({ id }).unwrap();
    navigate('/statistics/incomes');
  };

  return (
    <>
      {isDeleting && <LoaderFullScreen />}
      <DataHandler {...incomeData} />
      <UpdatePageInfo
        title={`${income?.description}`}
        backLink="/statistics/incomes"
      />
      {income && (
        <section className="grid gap-2 lg:gap-4">
          <section className="grid grid-cols-2 gap-2 lg:grid-cols-3 md:gap-4">
            <InfoCard iconName={IconName.cash} label="Amount">
              {formatCurrency(income.amount)}
            </InfoCard>
            <InfoCard iconName={IconName.calendar} label="Date">
              {formatDate(new Date(income.date))}
            </InfoCard>
            <InfoCard
              iconName={IconName.informationCircle}
              label="Type"
              className="max-lg:col-span-full"
              isLarge
            >
              Income
            </InfoCard>
            <InfoCard
              iconName={IconName.download}
              label="To account"
              className="col-span-full"
              isLarge
            >
              {account?.name ?? '-'}
            </InfoCard>
          </section>
          {income.categories.length > 0 && (
            <>
              <Divider>Categories</Divider>
              <ul>
                {(
                  income.categories as unknown as TransactionCategoryMappingDto[]
                )?.map(({ amount, category_id }) => (
                  <li className="grid grid-cols-2 gap-2">
                    <InfoCard
                      iconName={IconName.tag}
                      label="Category"
                      testId="category_label"
                    >
                      {getCategoryNameById(category_id as unknown as string)}
                    </InfoCard>
                    <InfoCard
                      iconName={IconName.cash}
                      label="Amount"
                      testId="category_amount"
                    >
                      {formatCurrency(amount)}
                    </InfoCard>
                  </li>
                ))}
              </ul>
            </>
          )}
          <ButtonGroup className="mt-4">
            <Button
              link={`/statistics/incomes/${id}/edit`}
              testId="edit-income-button"
            >
              Edit
            </Button>
            <IncomeDeleteModal handleDelete={handleDelete} />
          </ButtonGroup>
        </section>
      )}
    </>
  );
};
