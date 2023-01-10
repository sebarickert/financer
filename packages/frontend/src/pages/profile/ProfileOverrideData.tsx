import { ChangeEvent, useState } from 'react';
import { useMemo } from 'react';

import {
  UserDataImportDto,
  useUsersOverrideAllOwnUserDataMutation,
} from '$api/generated/financerApi';
import { Button } from '$elements/button/button';
import { Heading } from '$elements/heading/heading';
import { InfoCard } from '$elements/info-card/info-card';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import {
  Notification,
  NotificationProps,
} from '$elements/notification/notification';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const ProfileOverrideData = (): JSX.Element => {
  const [uploadedUserData, setUploadedUserData] =
    useState<UserDataImportDto | null>(null);
  const [overrideFilename, setOverrideFilename] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationProps | null>(
    null
  );
  const [overrideProfileData, { isLoading }] =
    useUsersOverrideAllOwnUserDataMutation();

  const overrideTranactionCount = useMemo(() => {
    if (!uploadedUserData) return null;
    return uploadedUserData.transactions.length;
  }, [uploadedUserData]);

  const overrideAccountCount = useMemo(() => {
    if (!uploadedUserData) return null;
    return uploadedUserData.accounts.length;
  }, [uploadedUserData]);

  const handleResetNotification = () => {
    setNotification({
      type: 'success',
      label: '',
      children: '',
    });
  };

  const handleOverrideData = async () => {
    if (!uploadedUserData) {
      setNotification({
        type: 'error',
        label: 'Upload failed',
        children: 'Cannot update uploaded user data.',
      });
      return;
    }

    try {
      const { payload: overrideMessage = '' } = await overrideProfileData({
        userDataImportDto: uploadedUserData,
      }).unwrap();

      setNotification({
        type: 'success',
        label: 'Successfully overridden',
        children: overrideMessage,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setNotification({
        type: 'error',
        label: 'Overridde failed',
        children: error.payload,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const { files } = changeEvent.target;
    const targetFile = files?.item(0);
    if (!targetFile) {
      setOverrideFilename(null);
      setUploadedUserData(null);
      setNotification({
        type: 'error',
        label: 'Upload failed',
        children: 'File not found',
      });
      return;
    }

    const fr = new FileReader();
    fr.onload = (readerEvent) => {
      if (
        readerEvent?.target?.result &&
        typeof readerEvent?.target?.result === 'string'
      ) {
        const result = JSON.parse(readerEvent.target.result);
        setUploadedUserData(result);
        setOverrideFilename(targetFile.name);
      } else {
        setNotification({
          type: 'error',
          label: 'Upload failed',
          children: 'Failed to parse JSON file',
        });
      }
    };
    fr.readAsText(targetFile);
  };

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo title="Override data (DANGER ZONE)" backLink="/profile" />
      {notification && (
        <Notification
          type={notification.type}
          label={notification.label}
          resetNotification={handleResetNotification}
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
              onChange={handleFileChange}
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
          <Button onClick={handleOverrideData}>Override my data</Button>
        </div>
      </section>
    </>
  );
};
