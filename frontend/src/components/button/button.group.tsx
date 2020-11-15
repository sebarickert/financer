import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  readonly children: React.ReactNode[];
  label?: string;
}

const ButtonGroup = ({ children, label }: IProps): JSX.Element => {
  return (
    <div>
      {label && (
        <h2 className="text-2xl leading-9 font-bold tracking-tight text-gray-900 mb-4">
          {label}
        </h2>
      )}
      <div className="flex">
        {/* eslint-disable react/no-array-index-key */}
        {children.map((child, index) => (
          <span
            className={`inline-flex rounded-md shadow-sm ${
              index > 0 ? "ml-3" : ""
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
