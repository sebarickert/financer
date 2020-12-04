import React from "react";
import StackedListBody from "./stacked-list.body";
import StackedListHeader, { TAddiotinalLabel } from "./stacked-list.header";
import StackedListRow, { IStackedListRowProps } from "./stacked-list.row";

interface IProps {
  addiotinalLabel?: TAddiotinalLabel;
  label: string;
  rows: IStackedListRowProps[];
}

const StackedList = ({ addiotinalLabel, label, rows }: IProps): JSX.Element => {
  return (
    <div className="py-8 px-4 -mx-4 bg-gray-100 md:rounded-lg md:-mx-5 md:px-5 lg:-mx-8 lg:px-8">
      <StackedListHeader label={label} addiotinalLabel={addiotinalLabel} />
      <StackedListBody>
        {rows.map(
          ({
            additionalInformation,
            additionalLabel,
            label: rowLabel,
            link,
            tags,
            id,
          }) => (
            <StackedListRow
              label={rowLabel}
              additionalLabel={additionalLabel}
              additionalInformation={additionalInformation}
              link={link}
              tags={tags}
              id={id}
              key={id}
            />
          )
        )}
      </StackedListBody>
    </div>
  );
};

export default StackedList;
