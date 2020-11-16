import React from "react";

export type TAddiotinalLabel = {
  label: string;
  accentLabel?: string;
};

interface IProps {
  label: string;
  addiotinalLabel?: TAddiotinalLabel;
}

const TableHeader = ({ label, addiotinalLabel }: IProps): JSX.Element => {
  return (
    <div className="sm:flex sm:items-end sm:justify-between">
      <h2 className="text-2xl leading-9 font-bold tracking-tight text-gray-900 mb-2 sm:mb-0 sm:leading-none">
        {label}
      </h2>
      {addiotinalLabel && (
        <h3 className="text-xl tracking-tight text-gray-900 leading-none">
          {addiotinalLabel.accentLabel && (
            <>
              <span className="text-sm text-gray-500 mb-2 inline-block">
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

export default TableHeader;
