'use client';

import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { UserDataImportDto } from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { ToastMessageTypes } from '$blocks/toast/toast';
import { settingsPaths } from '$constants/settings-paths';
import { Button } from '$elements/button/button';
import { Heading } from '$elements/heading/heading';
import { IconName } from '$elements/icon/icon';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { addToastMessage } from '$reducer/notifications.reducer';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface OverrideUserDataProps {
  onOverrideData: DefaultFormActionHandler;
}

export const OverrideUserData = ({
  onOverrideData,
}: OverrideUserDataProps): JSX.Element => {
  const dispatch = useDispatch();

  const successHandler = useCallback(() => {
    dispatch(
      addToastMessage({
        type: ToastMessageTypes.SUCCESS,
        message: 'User data has been successfully updated',
      }),
    );
  }, [dispatch]);

  const action = useFinancerFormState(
    'override-user-data',
    onOverrideData,
    successHandler,
  );

  const [uploadedUserData, setUploadedUserData] =
    useState<UserDataImportDto | null>(null);
  const [overrideFilename, setOverrideFilename] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
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

    const formData = new FormData();
    Object.entries(uploadedUserData).forEach(([key, value]) => {
      formData.append(key, JSON.stringify(value));
    });

    return action(formData);
  }, [action, dispatch, uploadedUserData]);

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

  const overrideDetails = useMemo(() => {
    const overrideAccountCount = uploadedUserData?.accounts.length ?? null;
    const overrideTransactionCount =
      uploadedUserData?.transactions.length ?? null;

    return [
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
  }, [
    uploadedUserData?.accounts.length,
    uploadedUserData?.transactions.length,
  ]);

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
            onChange={handleFileChange}
            accept="application/json"
          />
        </label>
        <span className="ml-2">{overrideFilename ?? 'No file selected'}</span>
      </div>
      <section>
        <Heading>Override data details</Heading>
        <DetailsList items={overrideDetails} className="mt-4" />
      </section>
      <Button onClick={handleSubmit} className="mt-12">
        Override my data
      </Button>
    </>
  );
};
