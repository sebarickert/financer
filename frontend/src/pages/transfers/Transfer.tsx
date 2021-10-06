import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";
import Icon from "../../components/icon/icon";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getTransactionCategoryMappingByTransactionId } from "../expenses/Expense";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "../profile/TransactionCategories/TransactionCategoriesService";
import { getTransferById, deleteTransfer } from "./TransferService";

interface IProps {
  handleDelete(): void;
}

const TransferDeleteModal = ({ handleDelete }: IProps) => (
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

const Transfer = (): JSX.Element => {
  const history = useHistory();
  const [transfer, setTransfer] = useState<ITransaction | undefined>(undefined);
  const [transactionCategoryMapping, setTransactionCategoryMapping] = useState<
    ITransactionCategoryMapping[] | undefined
  >(undefined);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategoryWithCategoryTree[] | null
  >(null);
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

    const fetchTransactionCategories = async () => {
      setTransactionCategories(
        await getAllTransactionCategoriesWithCategoryTree()
      );
    };

    fetchTransfer();
    fetchTransactionCategoryMapping();
    fetchTransactionCategories();
  }, [id]);

  const getCategoryNameById = (categoryId: string) =>
    transactionCategories?.find((category) => category._id === categoryId)
      ?.categoryTree || categoryId;

  const handleDelete = async () => {
    await deleteTransfer(id);
    history.push("/statistics/transfers");
  };

  return typeof transfer === "undefined" ||
    typeof transactionCategoryMapping === "undefined" ||
    transactionCategories === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${transfer.description} | Transfers`} />
      <section className="rounded-lg border bg-white sm:grid divide-y sm:divide-y-0 sm:divide-x">
        <div className="p-6">
          <header className="flex items-center mb-6">
            <span className="rounded-lg inline-flex p-3 text-white bg-blue-financer">
              <Icon type="switch-horizontal" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter ml-4">
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
      <div className="mt-6">
        <TransferDeleteModal handleDelete={handleDelete} />
      </div>
    </>
  );
};

export default Transfer;
