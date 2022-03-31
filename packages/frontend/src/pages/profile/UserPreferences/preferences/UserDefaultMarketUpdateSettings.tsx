import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Heading } from '../../../../components/heading/heading';
import { Icon } from '../../../../components/icon/icon';
import { Input } from '../../../../components/input/input';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { useUserDefaultMarketUpdateSettings } from '../../../../hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useAllTransactionCategories } from '../../../../hooks/transactionCategories/useAllTransactionCategories';

export const UserDefaultMarketUpdateSettings = (): JSX.Element => {
  const [defaultMarketSettings, setDefaultMarketUpdateSettings] =
    useUserDefaultMarketUpdateSettings();
  const [transactionDescription, setTransactionDescription] = useState<
    string | undefined
  >(defaultMarketSettings?.transactionDescription);
  const [category, setCategory] = useState<string | undefined>(
    defaultMarketSettings?.category
  );
  const categories = useAllTransactionCategories();

  useEffect(() => {
    if (typeof transactionDescription !== 'undefined') return;

    setTransactionDescription(defaultMarketSettings?.transactionDescription);
  }, [defaultMarketSettings?.transactionDescription, transactionDescription]);

  useEffect(() => {
    if (typeof category !== 'undefined') return;

    setCategory(defaultMarketSettings?.category);
  }, [defaultMarketSettings?.category, category]);

  const handleTransactionDescriptionInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionDescription(event.target.value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const handleSave = () => {
    setDefaultMarketUpdateSettings({
      transactionDescription: transactionDescription ?? '',
      category,
    });
  };

  return (
    <>
      <div className="bg-blue-financer -mx-6 -mt-8 text-center py-4 mb-6 px-6 relative">
        <NavLink
          to={'/profile/user-preferences'}
          className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-1/2"
        >
          <span className="sr-only">Go back</span>
          <Icon type={'chevron-left'} className="stroke-white" />
        </NavLink>
        <Heading
          variant="h1"
          className="!text-base !tracking-tight !text-white !font-semibold"
        >
          Market update settings
        </Heading>
      </div>
      <ModalCustom
        modalOpenButtonLabel="Set default market value update settings "
        onConfirm={handleSave}
        submitButtonLabel="Save"
      >
        <Input
          id="transactionDescription"
          type="text"
          isRequired
          value={defaultMarketSettings?.transactionDescription}
          onChange={handleTransactionDescriptionInputValueChange}
        >
          Transaction description
        </Input>
        <Select
          className="mt-4"
          id="category"
          options={[{ name: 'None', _id: undefined }, ...categories].map(
            ({ name, _id }) => ({
              label: name,
              value: _id,
            })
          )}
          defaultValue={defaultMarketSettings?.category}
          isRequired
          handleOnChange={handleSelectChange}
        >
          Category
        </Select>
      </ModalCustom>
    </>
  );
};
