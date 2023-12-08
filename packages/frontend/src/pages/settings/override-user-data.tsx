import { ChangeEvent } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { Button } from '$elements/button/button';
import { Heading } from '$elements/heading/heading';
import { InfoCard } from '$elements/info-card/info-card';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import {
  Notification,
  NotificationProps,
} from '$elements/notification/notification';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface OverrideUserDataProps {
  isLoading: boolean;
  overrideFilename: string | null;
  overrideAccountCount: number | null;
  overrideTranactionCount: number | null;
  notification: NotificationProps | null;
  onFileChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
  onResetNotification: () => void;
  onOverrideData: () => void;
}

export const OverrideUserData = ({
  isLoading,
  overrideFilename,
  overrideAccountCount,
  overrideTranactionCount,
  notification,
  onFileChange,
  onResetNotification,
  onOverrideData,
}: OverrideUserDataProps): JSX.Element => {
  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Override data (DANGER ZONE)"
        backLink={settingsPaths.default}
      />
      {notification && (
        <Notification
          type={notification.type}
          label={notification.label}
          resetNotification={onResetNotification}
        >
          {notification.children}
        </Notification>
      )}
      <section className="grid gap-6">
        <div>
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
        <section className="grid grid-cols-2 gap-4">
          <Heading className="col-span-full">Override data details</Heading>
          <InfoCard label="Account count">
            {overrideAccountCount ? `${overrideAccountCount}` : '-'}
          </InfoCard>
          <InfoCard label="Transaction count">
            {overrideTranactionCount ? `${overrideTranactionCount}` : '-'}
          </InfoCard>
        </section>
        <div>
          <Button onClick={onOverrideData}>Override my data</Button>
        </div>
      </section>
    </>
  );
};
