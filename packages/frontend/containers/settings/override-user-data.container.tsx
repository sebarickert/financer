import { useState, useMemo, ChangeEvent } from 'react';

import {
  UserDataImportDto,
  useUsersOverrideAllOwnUserDataMutation,
} from '$api/generated/financerApi';
import { NotificationProps } from '$elements/notification/notification';
import { OverrideUserData } from '$pages/settings/override-user-data';

export const OverrideUserDataContainer = () => {
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
    <OverrideUserData
      isLoading={isLoading}
      overrideFilename={overrideFilename}
      overrideAccountCount={overrideAccountCount}
      overrideTranactionCount={overrideTranactionCount}
      notification={notification}
      onFileChange={handleFileChange}
      onResetNotification={handleResetNotification}
      onOverrideData={handleOverrideData}
    />
  );
};
