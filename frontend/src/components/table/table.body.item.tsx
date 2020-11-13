import React from "react";

interface IProps {
  isAction?: boolean;
  isFirst?: boolean;
  children: string | JSX.Element;
}

const TableBodyItem = ({
  children,
  isFirst = false,
  isAction = false,
}: IProps): JSX.Element => {
  if (isFirst) {
    return (
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900 max-w-xs">
        {children}
      </td>
    );
  }

  if (isAction) {
    return (
      <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
        {/* TODO: Create ActionLink component for many use cases, e.g. Edit, View, Delete. */}
        <span className="text-blue-600 hover:text-blue-900">{children}</span>
      </td>
    );
  }

  return (
    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500 max-w-xs capitalize">
      {children}
    </td>
  );
};

export default TableBodyItem;
