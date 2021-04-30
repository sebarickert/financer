import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";
import Hero from "../../components/hero/hero";
import HeroLead from "../../components/hero/hero.lead";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
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
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTransfer = async () => {
      setTransfer(await getTransferById(id));
    };
    fetchTransfer();
  }, [id]);

  const handleDelete = async () => {
    await deleteTransfer(id);
    history.push("/transfers");
  };

  return typeof transfer === "undefined" ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${transfer.description} | Transfers`} />
      <Hero
        accent="Transfer"
        accentColor="blue"
        label={transfer.description ?? "plaa"}
      >
        <HeroLead>
          Below you are able to edit your transfer information or delete it
          altogether.
        </HeroLead>
        <ButtonGroup className="mt-12">
          <Button accentColor="blue" link={`/expenses/${id}/edit`}>
            Edit transfer
          </Button>
          <TransferDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </Hero>
      <DescriptionList label="Transaction details" className="mt-12">
        <DescriptionListItem label="Amount">
          {formatCurrency(transfer.amount)}
        </DescriptionListItem>
        <DescriptionListItem label="Date">
          {formatDate(new Date(transfer.date))}
        </DescriptionListItem>
      </DescriptionList>
    </>
  );
};

export default Transfer;
