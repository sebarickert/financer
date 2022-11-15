/* eslint-disable consistent-return */
import { ChangeEvent, useEffect, useState } from 'react';

import { Button } from '../../components/elements/button/button';
import { Heading } from '../../components/elements/heading/heading';
import { InfoCard } from '../../components/elements/info-card/info-card';
import {
  Notification,
  NotificationProps,
} from '../../components/elements/notification/notification';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';
import { useOverrideProfileData } from '../../hooks/profile/useOverrideProfileData';
import { IOverrideProfileData } from '../../services/ProfileService';

export const ProfileOverrideData = (): JSX.Element => {
  const [uploadedUserData, setUploadedUserData] =
    useState<IOverrideProfileData | null>(null);
  const [overrideTranactionCount, setOverrideTranactionCount] = useState<
    number | null
  >(null);
  const [overrideAccountCount, setOverrideAccountCount] = useState<
    number | null
  >(null);
  const [overrideFilename, setOverrideFilename] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationProps | null>(
    null
  );
  const overrideProfileData = useOverrideProfileData();

  useEffect(() => {
    if (!uploadedUserData) {
      setOverrideTranactionCount(null);
      setOverrideAccountCount(null);
      return;
    }

    setOverrideTranactionCount(uploadedUserData.transactions.length);
    setOverrideAccountCount(uploadedUserData.accounts.length);
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

    const { message: overrideMessage, status } = await overrideProfileData(
      uploadedUserData
    );

    if (status === 201) {
      setNotification({
        type: 'success',
        label: 'Successfully overridden',
        children: overrideMessage,
      });
    } else {
      setNotification({
        type: 'error',
        label: 'Overridde failed',
        children: overrideMessage,
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
