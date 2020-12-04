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
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight leading-none truncate">
        {label}
      </h2>
      {addiotinalLabel && (
        <h3 className="text-xl tracking-tight text-gray-900 leading-none flex-shrink-0 text-right ml-4 inline-flex items-center">
          {addiotinalLabel.accentLabel && (
            <>
              <span className="text-sm  mr-2 inline-block leading-none">
                {addiotinalLabel.accentLabel}
              </span>
            </>
          )}
          {addiotinalLabel.label}
        </h3>
      )}
    </div>
  );
};

export default StackedListHeader;
