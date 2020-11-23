import React from "react";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Hero from "../../components/hero/hero";
import SEO from "../../components/seo/seo";

const Dashboard = (): JSX.Element => {
  return (
    <>
      <SEO title="Dashboard" />
      <Hero accent="Your" accentColor="pink" label="Dashboard">
        Below you are able to see summaries of your added accounts, income and
        expenses.
      </Hero>
      <div className="mt-12">
        <ButtonGroup>
          <Button accentColor="green" link="/incomes/add">
            Add income
          </Button>
          <Button accentColor="red" link="/expenses/add">
            Add expense
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default Dashboard;
