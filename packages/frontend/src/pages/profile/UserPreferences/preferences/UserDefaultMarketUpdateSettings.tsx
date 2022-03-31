import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Heading } from '../../../../components/heading/heading';
import { Icon } from '../../../../components/icon/icon';
import { Input } from '../../../../components/input/input';
import { MobileHeader } from '../../../../components/mobile-header/mobile-header';
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
      <MobileHeader backLink={'/profile/user-preferences'}>
        Market update settings
      </MobileHeader>
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
