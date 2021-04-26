import React, { useState, useEffect } from "react";
import Button from "../../components/button/button";
import Container from "../../components/container/container";
import Hero from "../../components/hero/hero";
import HeroLead from "../../components/hero/hero.lead";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import StackedList from "../../components/stacked-list/stacked-list";
import { TAddiotinalLabel } from "../../components/table/table.header";
import monthNames from "../../constants/months";
import formatCurrency from "../../utils/formatCurrency";
import {
  groupIncomesByMonth,
  IIncomesPerMonth,
  sortIncomesByDate,
  sortIncomeStacksByMonth,
} from "./IncomeFuctions";
import { getAllIncomes } from "./IncomeService";

const Incomes = (): JSX.Element => {
  const [incomesRaw, setIncomesRaw] = useState<IIncome[] | null>(null);
  const [incomes, setIncomes] = useState<IIncomesPerMonth[]>([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      setIncomesRaw(await getAllIncomes());
    };

    fetchIncomes();
  }, []);

  useEffect(() => {
    if (incomesRaw === null) return;

    setIncomes(
      incomesRaw
        .reduce<IIncomesPerMonth[]>(groupIncomesByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [incomesRaw]);

  const getAddiotinalLabel = (total: number): TAddiotinalLabel => ({
    label: `${Number.isNaN(total) ? "-" : formatCurrency(total)}`,
    accentLabel: "Total",
  });

  return incomesRaw === null ? (
    <Loader loaderColor="green" />
  ) : (
    <>
      <SEO title="Incomes" />
      <Hero accent="Overview" accentColor="green" label="Incomes">
        <HeroLead>
          Below you are able to review all your added incomes and see a summary
          of the current month.
        </HeroLead>
        <Button className="mt-12" link="/incomes/add" accentColor="green">
          Add income
        </Button>
      </Hero>
      <Container className="mt-12">
        {incomes.map(({ year, month, rows, total }) => (
          <div className="mt-4 md:mt-6" key={`${year}-${month}`}>
            <StackedList
              addiotinalLabel={getAddiotinalLabel(total)}
              label={`${monthNames[month]}, ${year}`}
              rows={rows}
            />
          </div>
        ))}
      </Container>
    </>
  );
};

export default Incomes;
