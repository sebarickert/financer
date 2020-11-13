import React from "react";

import TableBodyItem from "./table.body.item";

export type IRow = {
  [key in string]: string | JSX.Element;
};

interface IProps {
  keys: string[];
  row: IRow;
  actionKeys?: string[];
}

const TableBodyRow = ({ keys, row, actionKeys = [] }: IProps): JSX.Element => {
  return (
    <tr>
      {keys.map((key, index) => (
        <TableBodyItem
          isFirst={index === 0}
          isAction={actionKeys.includes(key)}
        >
          {key in row ? row[key] : ""}
        </TableBodyItem>
      ))}
    </tr>
  );
};

export default TableBodyRow;
