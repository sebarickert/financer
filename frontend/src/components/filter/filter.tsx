import React, { useState } from "react";
import FilterItem from "./filter.item";

type FilterItemType = { label: string; onClick(): void };

interface IFilterProps {
  srTitle?: string;
  filters: FilterItemType[];
}

const Filter = ({ srTitle, filters }: IFilterProps): JSX.Element => {
  const [isActiveIndex, setIsActiveIndex] = useState(0);

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-8"
      aria-label={srTitle}
    >
      {filters.map(({ label, onClick }, index) => (
        <FilterItem
          onClick={onClick}
          setActive={() => setIsActiveIndex(index)}
          key={`filter-item-${label}`}
          isActive={isActiveIndex === index}
        >
          {label}
        </FilterItem>
      ))}
    </div>
  );
};

export default Filter;
