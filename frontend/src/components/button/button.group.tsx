import React from "react";

interface IProps {
  readonly children: React.ReactNode[];
  label?: string;
  isReverse?: boolean;
  className?: string;
}

const ButtonGroup = ({
  children,
  label,
  className = "",
  isReverse,
}: IProps): JSX.Element => {
  const horizontalMargin = isReverse ? "sm:mr-3" : "sm:ml-3";

  return (
    <div className={className}>
      {label && (
        <h2 className="text-2xl leading-9 font-bold tracking-tight text-gray-900 mb-4">
          {label}
        </h2>
      )}
      <div className={`sm:flex  ${isReverse ? "sm:flex-row-reverse" : ""}`}>
        {/* eslint-disable react/no-array-index-key */}
        {children.map((child, index) => (
          <span
            className={`block ${
              index > 0 ? `mt-3 sm:mt-0 ${horizontalMargin}` : ""
            }`}
            key={`button-${index}`}
          >
            {child}
          </span>
        ))}
        {/* eslint-enable react/no-array-index-key */}
      </div>
    </div>
  );
};

export default ButtonGroup;
