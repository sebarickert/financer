export const LinkListRow = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <li className="group">{children}</li>;
};
