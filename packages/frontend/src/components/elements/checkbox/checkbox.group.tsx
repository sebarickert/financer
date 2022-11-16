interface CheckboxGroupProps {
  readonly children: React.ReactNode[];
  label?: string;
  className?: string;
  testId?: string;
}

export const CheckboxGroup = ({
  children,
  label,
  className = '',
  testId,
}: CheckboxGroupProps): JSX.Element => {
  return (
    <fieldset
      className={`text-charcoal space-y-1 ${className}`}
      data-testid={testId}
    >
      {label && <legend className="sr-only">{label}</legend>}
      {/* eslint-disable react/no-array-index-key */}
      {children.map((child, index) => {
        if (index !== 0) {
          return <div key={`checkbox-${index}`}>{child}</div>;
        }

        return child;
      })}
      {/* eslint-enable react/no-array-index-key */}
    </fieldset>
  );
};
