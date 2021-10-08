/* eslint-disable consistent-return */
import React, { ChangeEvent, useEffect, useState } from 'react';

import { Button } from '../../components/button/button';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Hero } from '../../components/hero/hero';
import {
  Notification,
  INotificationProps,
} from '../../components/notification/notification';
import { SEO } from '../../components/seo/seo';

import {
  IOverrideProfileData,
  postOverrideProfileData,
} from './ProfileService';

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
  const [notification, setNotification] = useState<INotificationProps | null>(
    null
  );

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

    const override = await postOverrideProfileData(uploadedUserData);

    if (override.status < 300) {
      setNotification({
        type: 'success',
        label: 'Successfully overridden',
        children: override?.payload,
      });
    } else {
      setNotification({
        type: 'error',
        label: 'Overridde failed',
        children: override?.payload,
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
      <SEO title="Override data (DANGER ZONE)" />
      {notification && (
        <Notification
          type={notification.type}
          label={notification.label}
          resetNotification={handleResetNotification}
        >
          {notification.children}
        </Notification>
      )}
      <Hero label="Override your data" standAlone className="mb-12">
        Below you are able to import a JSON-file that contains your profile data
        from some other environment.
      </Hero>
      <div>
        <label
          htmlFor="selectFiles"
          className="inline-flex justify-center w-full sm:w-auto items-center px-4 py-2 border font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out leading-6 duration-150 text-base bg-blue-600 hover:bg-blue-500 active:bg-blue-700 border-transparent focus:ring-blue-500"
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
      <DescriptionList label="Override data details" className="mt-6">
        <DescriptionListItem label="Account count">
          {overrideAccountCount ? `${overrideAccountCount}` : '-'}
        </DescriptionListItem>
        <DescriptionListItem label="Transaction count">
          {overrideTranactionCount ? `${overrideTranactionCount}` : '-'}
        </DescriptionListItem>
      </DescriptionList>

      <Button onClick={handleOverrideData} accentColor="red" className="mt-6">
        Override my data
      </Button>
    </>
  );
};
