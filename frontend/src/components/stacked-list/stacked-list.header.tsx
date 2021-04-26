import React from "react";

export type TAddiotinalLabel = {
  label: string;
  accentLabel?: string;
};

interface IProps {
  label: string;
  addiotinalLabel?: TAddiotinalLabel;
}

const StackedListHeader = ({ label, addiotinalLabel }: IProps): JSX.Element => {
  return (
    <div className="flex flex-col shadow-lg p-6 bg-gray-800 rounded sticky top-4 lg:bg-white lg:shadow lg:flex-shrink-0 lg:w-80 lg:mr-6 space-y-6 mb-4">
      <h2 className="text-2xl font-bold tracking-tight leading-none truncate text-white lg:text-gray-900">
        {label}
      </h2>
      {addiotinalLabel && (
        <h3 className="text-lg tracking-tigh leading-none flex-shrink-0 inline-flex justify-between text-white lg:text-gray-900">
          {addiotinalLabel.accentLabel && (
            <>
              <span className="truncate">{addiotinalLabel.accentLabel}</span>
            </>
          )}
          {addiotinalLabel.label}
        </h3>
      )}
    </div>
  );
};

export default StackedListHeader;
