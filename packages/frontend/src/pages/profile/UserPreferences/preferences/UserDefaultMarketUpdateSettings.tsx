import { useState } from 'react';

import { Input } from '../../../../components/input/input';
import { ModalCustom } from '../../../../components/modal/custom/modal.custom';
import { Select } from '../../../../components/select/select';
import { useUserDefaultMarketUpdateSettings } from '../../../../hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useAllTransactionCategories } from '../../../../hooks/transactionCategories/useAllTransactionCategories';

export const UserDefaultMarketUpdateSettings = (): JSX.Element => {
  const [defaultMarketSettings, setDefaultMarketUpdateSettings] =
    useUserDefaultMarketUpdateSettings();
  const [transactionDescription, setTransactionDescription] = useState('');
  const [category, setCategory] = useState('');

  const categories = useAllTransactionCategories();

  const handleTransactionDescriptionInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionDescription(event.target.value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const handleSave = () => {
    setDefaultMarketUpdateSettings({ transactionDescription, category });
  };

  return (
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
        options={categories.map(({ name, _id }) => ({
          label: name,
          value: _id,
        }))}
        defaultValue={defaultMarketSettings?.category}
        isRequired
        handleOnChange={handleSelectChange}
      >
        Category
      </Select>
    </ModalCustom>
  );
};
