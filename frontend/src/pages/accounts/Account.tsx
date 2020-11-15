import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";

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
      <Hero accent="Account" accentColor="blue" label={account.name}>
        Below you are able to edit your accounts information and check your
        transaction history as well as balance.
      </Hero>
      <div className="mt-6">
        <Link to={`/accounts/${id}/edit`}>Edit account</Link>
      </div>
      <div className="mt-6">
        <ModalConfirm
          label="Delete account"
          submitButtonLabel="Delete"
          onConfirm={handleDelete}
          modalOpenButtonLabel="Delete account"
        >
          Are you sure you want to delete your account? All of your data will be
          permanently removed. This action cannot be undone.
        </ModalConfirm>
      </div>
    </>
  );
};

export default Account;
