import { Link } from 'react-router-dom';

import { Button } from '../button/button';

type Action = { label: string; color: 'blue' | 'red' | 'green'; link: string };

export interface ICustomStackedListRowProps extends IStackedListRowProps {
  date: Date;
}
export interface IStackedListRowProps {
  additionalInformation?: string[];
  label: string;
  link?: string;
  id: string;
  actions?: Action[];
  testId?: string;
}

export const StackedListRow = ({
  additionalInformation,
  label,
  link,
  actions,
  testId,
}: IStackedListRowProps): JSX.Element => {
  const stackedListRowContent = (
    <article className="relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500  grid grid-cols-[1fr,auto] gap-4 items-center">
      <div className="flex flex-col justify-center overflow-hidden">
        <h2 className="text-sm sm:text-base font-semibold truncate">{label}</h2>
        {additionalInformation && (
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 inline-flex flex-col">
            {additionalInformation.map((information) => {
              if (information === label) return null;

              return (
                <span key={information}>
                  {information.charAt(0).toUpperCase() + information.slice(1)}
                </span>
              );
            })}
          </p>
        )}
      </div>
      {actions && (
        <div>
          {actions.map(
            ({ label: actionLabel, color, link: actionLink }, index) => (
              <Button
                accentColor={color}
                className={`${index > 0 ? 'ml-3' : ''}`}
                // eslint-disable-next-line react/no-array-index-key
                key={`action-button-${index}`}
                link={actionLink}
              >
                {actionLabel}
              </Button>
            )
          )}
        </div>
      )}
    </article>
  );

  return (
    <li data-testid={testId}>
      {link ? (
        <Link to={link} className="block hover:bg-gray-50 focus:bg-gray-50">
          {stackedListRowContent}
        </Link>
      ) : (
        stackedListRowContent
      )}
    </li>
  );
};
