import React from "react";
import StatsHeader from "./stats.header";

interface IProps {
  children: React.ReactNode[];
  label?: string;
  className?: string;
}

const Stats = ({ children, label, className = "" }: IProps): JSX.Element => {
  return (
    <div className={`p-8 -mx-8 bg-gray-100 rounded-lg ${className}`}>
      {label && <StatsHeader>{label}</StatsHeader>}
      <div
        className={`grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow md:grid-cols-${children.length}`}
      >
        {/* eslint-disable react/no-array-index-key */}
        {children.map((child, index) => (
          <div
            className={`block ${
              index > 0
                ? `border-t border-gray-200 md:border-0 md:border-l`
                : ""
            }`}
            key={`stats-${index}`}
          >
            {child}
          </div>
        ))}
        {/* eslint-enable react/no-array-index-key */}
      </div>
    </div>
  );
};

export default Stats;
