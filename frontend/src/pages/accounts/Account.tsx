import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import Stats from "../../components/stats/stats";
import StatsItem from "../../components/stats/stats.item";
import formatCurrency from "../../utils/formatCurrency";

interface IProps {
  handleDelete(): void;
}

const AccountDeleteModal = ({ handleDelete }: IProps) => (
  <ModalConfirm
    label="Delete account"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete account"
    accentColor="red"
  >
    Are you sure you want to delete your account? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

const Account = (): JSX.Element => {
  const history = useHistory();
  const [account, setAccount] = useState<IAccount | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccount = async () => {
      const rawAccount = await fetch(`/api/account/${id}`);
      setAccount((await rawAccount.json()).payload);
    };
    fetchAccount();
  }, [id]);

  const handleDelete = async () => {
    await fetch(`/api/account/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    history.push("/accounts");
  };

  return typeof account === "undefined" ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${account.name}`} />
      <Hero accent="Account" accentColor="blue" label={account.name}>
        Below you are able to edit your accounts information and check your
        transaction history as well as balance.
      </Hero>
      <div className="mt-12">
        <ButtonGroup>
          <Button accentColor="blue" link={`/accounts/${id}/edit`}>
            Edit account
          </Button>
          <AccountDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </div>
      <Stats className="mt-12" label="Overview">
        <StatsItem statLabel="Balance">
          {formatCurrency(account.balance)}
        </StatsItem>
        <StatsItem statLabel="Type">{account.type}</StatsItem>
      </Stats>
    </>
  );
};

export default Account;
