interface IQuickLinksProps {
  className?: string;
  srTitle?: string;
  readonly children: React.ReactNode[];
  isVertical?: boolean;
}

export const QuickLinks = ({
  className,
  srTitle,
  children,
  isVertical,
}: IQuickLinksProps): JSX.Element => {
  return (
    <section aria-labelledby="quick-links-title" className={className}>
      <div
        className={`overflow-hidden grid gap-4 ${
          !isVertical &&
          (children.filter((child) => typeof child !== 'undefined' && child)
            .length %
            3 ===
          0
            ? 'md:grid-cols-3'
            : 'sm:grid-cols-2')
        }`}
      >
        <h2 className="sr-only" id="quick-links-title">
          {srTitle ?? 'Quick links'}
        </h2>
        {children}
      </div>
    </section>
  );
};
