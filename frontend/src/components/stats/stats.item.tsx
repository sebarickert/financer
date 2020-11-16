import React from "react";

interface IProps {
  children: string;
  statLabel: string;
}

const StatsItem = ({ children, statLabel }: IProps): JSX.Element => {
  return (
    <div className="px-4 py-5 sm:p-6">
      <dl>
        <dt className="text-base leading-6 font-normal text-gray-900">
          {statLabel}
        </dt>
        <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div className="flex items-baseline text-2xl leading-8 font-semibold text-gray-900 capitalize">
            {children}
          </div>
        </dd>
      </dl>
    </div>
  );
};

export default StatsItem;
