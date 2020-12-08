import React from "react";
import Button from "../../components/button/button";

const Profile = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { value } = event.target.userData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawOverride = await fetch("/api/profile/my-data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: value,
    });
    const override: IApiResponse<string> = await rawOverride.json();
    if (override.status < 300) {
      // eslint-disable-next-line no-alert
      alert(`Successfully overridden: ${override?.payload}`);
    } else {
      // eslint-disable-next-line no-alert
      alert(`Failed override: ${override.errors?.join(", ")}`);
    }
  };

  return (
    <>
      <Button link="/api/profile/my-data">Download my data</Button>
      <form className="block mt-12" onSubmit={handleSubmit}>
        <textarea name="userData" id="userData" className="w-full" />
        <Button type="submit" accentColor="red" className="mt-2">
          Override my data
        </Button>
      </form>
    </>
  );
};

export default Profile;
