import React from 'react';

import { TableBodyItem } from './table.body.item';

export type IRow = Record<string, string | number | JSX.Element>;

interface ITableBodyRowProps {
  keys: string[];
  row: IRow;
  actionKeys?: string[];
  dataKeyColumn: string;
}

export const TableBodyRow = ({
  keys,
  row,
  actionKeys = [],
  dataKeyColumn,
}: ITableBodyRowProps): JSX.Element => {
  return (
    <tr>
      {keys.map((key, index) => (
        <TableBodyItem
          isFirst={index === 0}
          isAction={actionKeys.includes(key)}
          key={`${row[dataKeyColumn]}-${key}` as string}
        >
          {key in row ? row[key] : ''}
        </TableBodyItem>
      ))}
    </tr>
  );
};
