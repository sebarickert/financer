/* eslint-disable no-alert, consistent-return */
import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "../../components/button/button";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";

interface IOveridata {
  accounts: IAccount[];
  transactions: ITransaction[];
  user: IUser;
}

const Profile = (): JSX.Element => {
  const [uploadedUserData, setUploadedUserData] = useState<IOveridata | null>(
    null
  );
  const [overrideTranactionCount, setOverrideTranactionCount] = useState<
    number | null
  >(null);
  const [overrideAccountCount, setOverrideAccountCount] = useState<
    number | null
  >(null);
  const [overrideFilename, setOverrideFilename] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadedUserData) {
      setOverrideTranactionCount(null);
      setOverrideAccountCount(null);
      return;
    }

    setOverrideTranactionCount(uploadedUserData.transactions.length);
    setOverrideAccountCount(uploadedUserData.accounts.length);
  }, [uploadedUserData]);

  const handleOverrideData = async () => {
    const rawOverride = await fetch("/api/profile/my-data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadedUserData),
    });
    const override: IApiResponse<string> = await rawOverride.json();
    if (override.status < 300) {
      alert(`Successfully overridden: ${override?.payload}`);
    } else {
      alert(`Failed override: ${override.errors?.join(", ")}`);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const { files } = changeEvent.target;
    const targetFile = files?.item(0);
    if (!targetFile) {
      setOverrideFilename(null);
      setUploadedUserData(null);
      alert("File not found");
      return;
    }

    const fr = new FileReader();
    fr.onload = (readerEvent) => {
      if (
        readerEvent?.target?.result &&
        typeof readerEvent?.target?.result === "string"
      ) {
        const result = JSON.parse(readerEvent.target.result);
        setUploadedUserData(result);
        setOverrideFilename(targetFile.name);
      } else {
        alert("Failed to parse JSON file");
      }
    };
    fr.readAsText(targetFile);
  };

  return (
    <>
      <Button link="/api/profile/my-data" className="block">
        Download my data
      </Button>
      <div className="block mt-16 ">
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
        <span className="ml-2">{overrideFilename || "No file selected"}</span>
      </div>
      <DescriptionList label="Override data details" className="mt-6">
        <DescriptionListItem label="Account count">
          {overrideAccountCount ? `${overrideAccountCount}` : "-"}
        </DescriptionListItem>
        <DescriptionListItem label="Transaction count">
          {overrideTranactionCount ? `${overrideTranactionCount}` : "-"}
        </DescriptionListItem>
      </DescriptionList>

      <Button onClick={handleOverrideData} accentColor="red" className="mt-6">
        Override my data
      </Button>
    </>
  );
};

export default Profile;
