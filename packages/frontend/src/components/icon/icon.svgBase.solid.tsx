interface IconSvgBaseProps {
  children: React.ReactNode;
  className: string;
}

export const IconSvgBaseSolid = ({
  children,
  className,
}: IconSvgBaseProps): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
};
