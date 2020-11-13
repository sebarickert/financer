import React from "react";
import TableHead from "./table.head";
import TableHeader, { TAddiotinalLabel } from "./table.header";
import TableResponsiveContainer from "./table.responsive";
import TableBody from "./table.body";
import TableHeadItem from "./table.head.item";
import TableBodyRow, { IRow } from "./table.body.row";

export interface ITableHead {
  key: string;
  label?: string;
}

interface IProps {
  addiotinalLabel?: TAddiotinalLabel;
  label: string;
  rows: IRow[];
  tableHeads: ITableHead[];
}

const Table = ({
  addiotinalLabel,
  label,
  rows,
  tableHeads,
}: IProps): JSX.Element => {
  const actionKeys = tableHeads
    .filter(
      ({ label: headLabel }) =>
        typeof headLabel === "undefined" || headLabel.length === 0
    )
    .map(({ key }) => key);
  const tableKeys = tableHeads.map(({ key }) => key);

  return (
    <>
      <TableHeader label={label} addiotinalLabel={addiotinalLabel} />
      <TableResponsiveContainer>
        <TableHead>
          {tableHeads.map(({ key, label: headLabel }) => (
            <TableHeadItem key={key} isAction={actionKeys.includes(key)}>
              {headLabel}
            </TableHeadItem>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableBodyRow keys={tableKeys} row={row} actionKeys={actionKeys} />
          ))}
        </TableBody>
      </TableResponsiveContainer>
    </>
  );
};

export default Table;
