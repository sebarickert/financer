import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Icon } from '../../components/icon/icon';
import { Loader } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { SEO } from '../../components/seo/seo';
import { useAllTransactionCategoriesWithCategoryTree } from '../../hooks/useAllTransactionCategories';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { getTransactionCategoryMappingByTransactionId } from '../expenses/Expense';

import { getTransferById, deleteTransfer } from './TransferService';

interface ITransferDeleteModalProps {
  handleDelete(): void;
}

const TransferDeleteModal = ({ handleDelete }: ITransferDeleteModalProps) => (
  <ModalConfirm
    label="Delete transfer"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete transfer"
    accentColor="red"
  >
    Are you sure you want to delete your transfer? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const Transfer = (): JSX.Element => {
  const history = useHistory();
  const [transfer, setTransfer] = useState<ITransaction | undefined>(undefined);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
  const transactionCategories = useAllTransactionCategoriesWithCategoryTree();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTransfer = async () => {
      setTransfer(await getTransferById(id));
    };

    const fetchTransactionCategoryMapping = async () => {
      setTransactionCategoryMapping(
        await getTransactionCategoryMappingByTransactionId(id)
      );
    };

    fetchTransfer();
    fetchTransactionCategoryMapping();
  }, [id]);

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    await deleteTransfer(id);
    history.push('/statistics/transfers');
  };

  return typeof transfer === 'undefined' ||
    typeof transactionCategoryMapping === 'undefined' ||
    transactionCategories === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${transfer.description} | Transfers`} />
      <section className="bg-white border divide-y rounded-lg sm:grid sm:divide-y-0 sm:divide-x">
        <div className="p-6">
          <header className="flex items-center mb-6">
            <span className="inline-flex p-3 text-white rounded-lg bg-blue-financer">
              <Icon type="switch-horizontal" />
            </span>
            <h1 className="ml-4 text-2xl font-bold tracking-tighter sm:text-3xl">
              {transfer.description}
            </h1>
          </header>
          <DescriptionList label="Transaction details">
            <DescriptionListItem label="Amount">
              {formatCurrency(transfer.amount)}
            </DescriptionListItem>
            <DescriptionListItem label="Date">
              {formatDate(new Date(transfer.date))}
            </DescriptionListItem>
          </DescriptionList>
          {transactionCategoryMapping.length > 0 && (
            <DescriptionList label="Categories" className="mt-6" visibleLabel>
              {transactionCategoryMapping?.map(({ amount, category_id }) => (
                <DescriptionListItem label={getCategoryNameById(category_id)}>
                  {formatCurrency(amount)}
                </DescriptionListItem>
              ))}
            </DescriptionList>
          )}
        </div>
      </section>
      <ButtonGroup className="mt-6">
        <Button
          link={`/statistics/transfers/${id}/edit`}
          testId="edit-transfer-button"
        >
          Edit
        </Button>
        <TransferDeleteModal handleDelete={handleDelete} />
      </ButtonGroup>
    </>
  );
};
