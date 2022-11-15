interface IconSvgBaseProps {
  children: React.ReactNode;
  className: string;
}

export const IconSvgBase = ({
  children,
  className,
}: IconSvgBaseProps): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
};
