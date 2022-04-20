import { useNavigate } from 'react-router-dom';

import { Form } from '../../../../components/form/form';
import { Input } from '../../../../components/input/input';
import { UpdatePageInfo } from '../../../../components/seo/updatePageInfo';
import { useUserTransactionListChunkSize } from '../../../../hooks/profile/user-preference/useUserTransactionListChunkSize';

export const UserTransactionListChunkSize = (): JSX.Element => {
  const navigate = useNavigate();
  const [defaultChunkSize, setDefaultChunkSize] =
    useUserTransactionListChunkSize();

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      chunkSize: { value },
    } = event.target as unknown as {
      chunkSize: HTMLInputElement;
    };

    await Promise.all([setDefaultChunkSize(Number(value))]);

    navigate('/profile/user-preferences');
  };

  return (
    <>
      <UpdatePageInfo
        title="Max amount of items per page"
        backLink={'/profile/user-preferences'}
      />
      <Form
        handleSubmit={handleSave}
        submitLabel="Save"
        formFooterBackLink="/profile/user-preferences"
      >
        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
          <Input
            id="chunkSize"
            type="number"
            min={3}
            step={1}
            max={100}
            isRequired
            value={defaultChunkSize}
          >
            Items per page, e.g. transactions
          </Input>
        </div>
      </Form>
    </>
  );
};
