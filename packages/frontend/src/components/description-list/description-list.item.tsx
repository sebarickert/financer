export interface IDescriptionListItemProps {
  label: string;
  children: string;
  testId?: string;
}

export const DescriptionListItem = ({
  label,
  children,
  testId,
}: IDescriptionListItemProps): JSX.Element => {
  return (
    <>
      <dt className="text-xs font-medium text-gray-700 truncate lg:text-sm">
        {label}
      </dt>
      <dd
        className="text-xl font-bold tracking-tight truncate"
        data-testid={testId}
      >
        {children}
      </dd>
    </>
  );
};
