import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Form } from '../../../../components/blocks/form/form';
import { Input } from '../../../../components/elements/input/input';
import { Select } from '../../../../components/elements/select/select';
import { UpdatePageInfo } from '../../../../components/renderers/seo/updatePageInfo';
import { useUserDefaultMarketUpdateSettings } from '../../../../hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useAllTransactionCategoriesWithCategoryTree } from '../../../../hooks/transactionCategories/useAllTransactionCategories';

export const UserDefaultMarketUpdateSettings = (): JSX.Element => {
  const navigate = useNavigate();
  const [defaultMarketSettings, setDefaultMarketUpdateSettings] =
    useUserDefaultMarketUpdateSettings();
  const [transactionDescription, setTransactionDescription] = useState<
    string | undefined
  >(defaultMarketSettings?.transactionDescription);
  const [category, setCategory] = useState<string | undefined>(
    defaultMarketSettings?.category
  );
  const categories = useAllTransactionCategoriesWithCategoryTree();

  useEffect(() => {
    if (typeof transactionDescription !== 'undefined') return;

    setTransactionDescription(defaultMarketSettings?.transactionDescription);
  }, [defaultMarketSettings?.transactionDescription, transactionDescription]);

  useEffect(() => {
    if (typeof category !== 'undefined') return;

    setCategory(defaultMarketSettings?.category);
  }, [defaultMarketSettings?.category, category]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      transactionDescription: { value: transactionDescriptionValue },
      category: { value: categoryValue },
    } = event.target as unknown as {
      transactionDescription: HTMLInputElement;
      category: HTMLSelectElement;
    };

    await Promise.all([
      setDefaultMarketUpdateSettings({
        transactionDescription: transactionDescriptionValue ?? '',
        category: categoryValue,
      }),
    ]);

    navigate('/profile/user-preferences');
  };

  return (
    <>
      <UpdatePageInfo
        title="Market update settings"
        backLink={'/profile/user-preferences'}
      />
      <Form
        handleSubmit={handleSave}
        submitLabel="Save"
        formFooterBackLink="/profile/user-preferences"
      >
        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
          <Input
            id="transactionDescription"
            type="text"
            isRequired
            value={defaultMarketSettings?.transactionDescription}
          >
            Transaction description
          </Input>
          <Select
            id="category"
            options={[{ name: 'None', _id: '' }, ...categories].map(
              ({ name, _id }) => ({
                label: name,
                value: _id,
              })
            )}
            defaultValue={defaultMarketSettings?.category}
            isRequired
          >
            Category
          </Select>
        </div>
      </Form>
    </>
  );
};
