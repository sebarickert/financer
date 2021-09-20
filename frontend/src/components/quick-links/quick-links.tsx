import React from "react";

interface IQuickLinksProps {
  className?: string;
  srTitle?: string;
  readonly children: React.ReactNode[];
}

const QuickLinks = ({
  className,
  srTitle,
  children,
}: IQuickLinksProps): JSX.Element => {
  return (
    <section aria-labelledby="quick-links-title" className={className}>
      <div
        className={`rounded-lg overflow-hidden grid gap-4 ${
          children.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        <h2 className="sr-only" id="quick-links-title">
          {srTitle ?? "Quick links"}
        </h2>
        {children}
      </div>
    </section>
  );
};

export default QuickLinks;
