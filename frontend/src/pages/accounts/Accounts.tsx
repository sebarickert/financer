import React from "react";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";

const Accounts = (): JSX.Element => {
  return (
    <>
      <Hero accent="Your" accentColor="blue" label="Accounts">
        Below you are able to add your various accounts where you have your
        savings or investments to calculate total amount.
      </Hero>
      <div className="mt-6">
        <Button href="/accounts/add" accentColor="blue">
          Add account
        </Button>
      </div>
    </>
  );
};

export default Accounts;
