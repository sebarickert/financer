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
    <div className="flex items-end justify-between">
      <h2 className="text-2xl font-bold tracking-tight leading-none truncate">
        {label}
      </h2>
      {addiotinalLabel && (
        <h3 className="text-xl tracking-tight text-gray-900 leading-none text-right flex-shrink-0">
          {addiotinalLabel.accentLabel && (
            <>
              <span className="text-sm text-gray-500 mb-2 inline-block leading-none">
                {addiotinalLabel.accentLabel}
              </span>
              <br />
            </>
          )}
          {addiotinalLabel.label}
        </h3>
      )}
    </div>
  );
};

export default StackedListHeader;
