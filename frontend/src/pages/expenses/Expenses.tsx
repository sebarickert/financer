import React, { useState, useEffect } from "react";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";

const Expenses = (): JSX.Element => {
  return (
    <>
      <Hero accent="Your" accentColor="red" label="Expenses">
        Below you are able to review all your added expenses and see a summary
        of the current month.
      </Hero>
      <div className="mt-6">
        <Button link="/expenses/add" accentColor="red">
          Add expense
        </Button>
      </div>
    </>
  );
};

export default Expenses;
