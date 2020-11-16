import React from "react";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";

const Incomes = (): JSX.Element => {
  return (
    <>
      <Hero accent="Your" accentColor="green" label="Incomes">
        Below you are able to review all your added incomes and see a summary of
        the current month.
      </Hero>
      <div className="mt-6">
        <Button link="/incomes/add" accentColor="green">
          Add income
        </Button>
      </div>
    </>
  );
};

export default Incomes;
