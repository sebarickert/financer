import React from 'react';

import { StackedListBody } from './stacked-list.body';
import { StackedListRow, IStackedListRowProps } from './stacked-list.row';

interface IStackedListProps {
  rows: IStackedListRowProps[];
  rowTestId?: string;
}

export const StackedList = ({
  rows,
  rowTestId,
}: IStackedListProps): JSX.Element => {
  return (
    <StackedListBody>
      {rows.map(
        ({ additionalInformation, label: rowLabel, link, id, actions }) => (
          <StackedListRow
            label={rowLabel}
            additionalInformation={additionalInformation}
            link={link}
            actions={actions}
            id={id}
            key={id}
            testId={rowTestId}
          />
        )
      )}
    </StackedListBody>
  );
};
