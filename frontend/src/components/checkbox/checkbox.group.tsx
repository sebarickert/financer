import React from "react";

interface IProps {
  readonly children: React.ReactNode[];
  label?: string;
  className?: string;
}

const CheckboxGroup = ({
  children,
  label,
  className = "",
}: IProps): JSX.Element => {
  return (
    <fieldset className={`space-y-3 ${className}`}>
      {label && <legend className="sr-only">{label}</legend>}
      {/* eslint-disable react/no-array-index-key */}
      {children.map((child, index) => {
        if (index !== 0) {
          return <div key={`checkbox-${index}`}>{child}</div>;
        }

        return child;
      })}
      {/* eslint-enable react/no-array-index-key */}
    </fieldset>
  );
};

export default CheckboxGroup;
