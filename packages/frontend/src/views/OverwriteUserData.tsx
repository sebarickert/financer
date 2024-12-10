'use client';

import clsx from 'clsx';
import { Info } from 'lucide-react';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { UserDataImportDto } from '$api/generated/financerApi';
import { DetailsList } from '$blocks/DetailsList';
import { ToastMessageTypes } from '$blocks/Toast/Toast';
import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { addToastMessage } from '$reducer/notifications.reducer';

type OverwriteUserDataProps = {
  onOverwriteData: DefaultFormActionHandler;
};

const formName = 'overwrite-user-data';

export const OverwriteUserData = ({
  onOverwriteData,
}: OverwriteUserDataProps): JSX.Element => {
  const dispatch = useDispatch();

  const successHandler = useCallback(() => {
    dispatch(
      addToastMessage({
        type: ToastMessageTypes.SUCCESS,
        message: 'User data has been successfully updated',
        id: formName,
      }),
    );
  }, [dispatch]);

  const action = useFinancerFormState(
    formName,
    onOverwriteData,
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
        Icon: Info,
        label: 'Account Count',
        description: overrideAccountCount ?? '-',
      },
      {
        Icon: Info,
        label: 'Transaction Count',
        description: overrideTransactionCount ?? '-',
      },
    ];
  }, [
    uploadedUserData?.accounts.length,
    uploadedUserData?.transactions.length,
  ]);

  return (
    <section>
      <div className="mb-8 ">
        <label
          htmlFor="selectFiles"
          className={clsx(
            'focus-within:focus-highlight button-secondary',
            'px-6 py-3 rounded-md',
            'inline-flex items-center justify-center w-full cursor-pointer sm:w-auto',
          )}
        >
          Choose file
          <input
            className="sr-only"
            type="file"
            id="selectFiles"
            onChange={handleFileChange}
            accept="application/json"
          />
        </label>
        <span className="ml-2">{overrideFilename ?? 'No file selected'}</span>
      </div>
      <section>
        <Heading>Overwrite Data Details</Heading>
        <div className="p-6 rounded-md bg-layer">
          <DetailsList items={overrideDetails} />
        </div>
      </section>
      <Button onClick={handleSubmit} className="mt-12">
        Overwrite My Data
      </Button>
    </section>
  );
};
