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
      <div className="rounded-lg overflow-hidden border sm:grid sm:grid-cols-2 sm:gap-px">
        <h2 className="sr-only" id="quick-links-title">
          {srTitle ?? "Quick links"}
        </h2>
        {children.map((child, index) => {
          if (index === 0) {
            return (
              <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-tl-lg rounded-tr-lg sm:rounded-tr-none sm:rounded-bl-lg">
                {child}
              </div>
            );
          }

          return (
            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-bl-lg rounded-br-lg sm:rounded-bl-none sm:rounded-tr-lg border-t border-gray-200 sm:border-t-0">
              {child}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickLinks;
