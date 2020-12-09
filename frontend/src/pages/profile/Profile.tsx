/* eslint-disable no-alert */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react";
import Button from "../../components/button/button";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";
import capitalize from "../../utils/capitalize";
import formatCurrency from "../../utils/formatCurrency";

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
  const handleFileChange = (changeEvent: any) => {
    const { files } = changeEvent?.target;
    if (files.length <= 0) {
      return alert("File not found");
    }

    const fr = new FileReader();
    fr.onload = (readerEvent) => {
      if (
        readerEvent?.target?.result &&
        typeof readerEvent?.target?.result === "string"
      ) {
        const result = JSON.parse(readerEvent.target.result);
        setUploadedUserData(result);
      } else {
        alert("Failed to parse JSON file");
      }
    };
    fr.readAsText(files.item(0));
  };

  return (
    <>
      <Button link="/api/profile/my-data" className="block">
        Download my data
      </Button>
      <input
        className="block mt-16"
        type="file"
        id="selectFiles"
        onChange={handleFileChange}
        accept="application/json"
      />
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
