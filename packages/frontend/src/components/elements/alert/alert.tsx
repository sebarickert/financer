import clsx from 'clsx';

import { Icon, IconName } from '../icon/icon';

interface AlertProps {
  children: React.ReactNode;
  additionalInformation?: string[];
  testId?: string;
}

export const Alert = ({
  children,
  additionalInformation,
  testId,
}: AlertProps): JSX.Element => {
  return (
    <div
      className="p-4 mb-6 text-white rounded-md bg-charcoal"
      data-testid={testId}
    >
      <div className="flex gap-4">
        <Icon
          type={IconName.exclamation}
          className={clsx('flex-shrink-0 stroke-white')}
        />
        <div>
          <h3 className="text-sm font-medium leading-5 text-red-800">
            {children}
          </h3>
          {additionalInformation && (
            <div className="mt-2 text-sm leading-5 text-red-700">
              <ul className="pl-5 list-disc">
                {additionalInformation.map((information, index) => (
                  <li key={information} className={index > 0 ? 'mt-1' : ''}>
                    {information}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
