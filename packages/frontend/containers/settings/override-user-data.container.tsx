'use client';

import { useState, useMemo, ChangeEvent, FC } from 'react';
import { useDispatch } from 'react-redux';

import {
  UserDataImportDto,
  useUsersOverrideAllOwnUserDataMutation,
} from '$api/generated/financerApi';
import { ToastMessageTypes } from '$blocks/toast/toast';
import { addToastMessage } from '$reducer/notifications.reducer';
import { clearAllCaches } from '$ssr/api/clear-cache';
import { OverrideUserData } from '$views/settings/override-user-data';

export const OverrideUserDataContainer: FC = () => {
  const [uploadedUserData, setUploadedUserData] =
    useState<UserDataImportDto | null>(null);
  const [overrideFilename, setOverrideFilename] = useState<string | null>(null);

  const [overrideProfileData] = useUsersOverrideAllOwnUserDataMutation();

  const dispatch = useDispatch();

  const overrideTransactionCount = useMemo(() => {
    if (!uploadedUserData) return null;
    return uploadedUserData.transactions.length;
  }, [uploadedUserData]);

  const overrideAccountCount = useMemo(() => {
    if (!uploadedUserData) return null;
    return uploadedUserData.accounts.length;
  }, [uploadedUserData]);

  const handleOverrideData = async () => {
    if (!uploadedUserData) {
      dispatch(
        addToastMessage({
          type: ToastMessageTypes.ERROR,
          message: 'Upload failed',
          additionalInformation: 'Cannot update uploaded user data',
        }),
      );
      return;
    }

    try {
      const { payload: overrideMessage = '' } = await overrideProfileData({
        userDataImportDto: uploadedUserData,
      }).unwrap();
      await clearAllCaches();

      dispatch(
        addToastMessage({
          type: ToastMessageTypes.SUCCESS,
          message: overrideMessage,
        }),
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(
        addToastMessage({
          type: ToastMessageTypes.ERROR,
          message: 'Override failed',
          additionalInformation: error.payload,
        }),
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const { files } = changeEvent.target;
    const targetFile = files?.item(0);
    if (!targetFile) {
      setOverrideFilename(null);
      setUploadedUserData(null);

      dispatch(
        addToastMessage({
          type: ToastMessageTypes.ERROR,
          message: 'Upload failed',
          additionalInformation: 'File not found',
        }),
      );

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
        dispatch(
          addToastMessage({
            type: ToastMessageTypes.ERROR,
            message: 'Upload failed',
            additionalInformation: 'Failed to parse JSON file',
          }),
        );
      }
    };
    fr.readAsText(targetFile);
  };

  return (
    <OverrideUserData
      overrideFilename={overrideFilename}
      overrideAccountCount={overrideAccountCount}
      overrideTransactionCount={overrideTransactionCount}
      onFileChange={handleFileChange}
      onOverrideData={handleOverrideData}
    />
  );
};
