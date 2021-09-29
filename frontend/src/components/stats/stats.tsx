import React from "react";
import StatsHeader from "./stats.header";

interface IProps {
  children: React.ReactNode[];
  label?: string;
  className?: string;
}

const Stats = ({ children, label, className = "" }: IProps): JSX.Element => {
  return (
    <section className={`${className}`}>
      {label && <StatsHeader>{label}</StatsHeader>}
      <div
        className={`grid gap-4 ${
          children.filter((child) => typeof child !== "undefined" && child)
            .length %
            3 ===
          0
            ? "md:grid-cols-3"
            : "sm:grid-cols-2"
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default Stats;
