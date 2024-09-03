import { ChangeEvent } from 'react';

import { DetailsList } from '$blocks/details-list/details-list';
import { settingsPaths } from '$constants/settings-paths';
import { Button } from '$elements/button/button';
import { Heading } from '$elements/heading/heading';
import { IconName } from '$elements/icon/icon';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface OverrideUserDataProps {
  overrideFilename: string | null;
  overrideAccountCount: number | null;
  overrideTransactionCount: number | null;
  onFileChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
  onOverrideData: () => void;
}

export const OverrideUserData = ({
  overrideFilename,
  overrideAccountCount,
  overrideTransactionCount,
  onFileChange,
  onOverrideData,
}: OverrideUserDataProps): JSX.Element => {
  const overrideDetails = [
    {
      icon: IconName.informationCircle,
      label: 'Account count',
      description: overrideAccountCount ?? '-',
    },
    {
      icon: IconName.informationCircle,
      label: 'Transaction count',
      description: overrideTransactionCount ?? '-',
    },
  ];

  return (
    <>
      <UpdatePageInfo backLink={settingsPaths.default} />
      <div className="mb-8">
        <label
          htmlFor="selectFiles"
          className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium tracking-tight text-white transition duration-150 ease-in-out rounded-md cursor-pointer sm:w-auto focus:ring-2 focus:ring-offset-2 focus:outline-none hover:opacity-75 focus:opacity-75 bg-charcoal focus:ring-charcoal"
        >
          Choose file
          <input
            className="hidden"
            type="file"
            id="selectFiles"
            onChange={onFileChange}
            accept="application/json"
          />
        </label>
        <span className="ml-2">{overrideFilename || 'No file selected'}</span>
      </div>
      <section>
        <Heading>Override data details</Heading>
        <DetailsList items={overrideDetails} className="mt-4" />
      </section>
      <Button onClick={onOverrideData} className="mt-12">
        Override my data
      </Button>
    </>
  );
};
