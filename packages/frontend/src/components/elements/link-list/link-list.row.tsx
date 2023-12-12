export const LinkListRow = ({
  children,
  testId,
}: {
  children: React.ReactNode;
  testId?: string;
}): JSX.Element => {
  return (
    <li className="group" data-testid={testId}>
      {children}
    </li>
  );
};
