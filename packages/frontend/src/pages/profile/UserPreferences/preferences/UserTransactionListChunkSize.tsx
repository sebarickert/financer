import { useNavigate } from 'react-router-dom';

import { Form } from '$blocks/form/form';
import { Input } from '$elements/input/input';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import {
  useUpdateUserTransactionListChunkSize,
  useUserTransactionListChunkSize,
} from '$hooks/profile/user-preference/useUserTransactionListChunkSize';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const UserTransactionListChunkSize = (): JSX.Element | null => {
  const navigate = useNavigate();
  const { data: defaultChunkSize, isLoading: isLoadingDefault } =
    useUserTransactionListChunkSize();

  const [setDefaultChunkSize, { isLoading: isUpdating }] =
    useUpdateUserTransactionListChunkSize();

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

  const isLoading = isLoadingDefault;

  return null;

  // return (
  //   <>
  //     {isUpdating && <LoaderFullScreen />}
  //     <UpdatePageInfo
  //       title="Max amount of items per page"
  //       backLink={'/profile/user-preferences'}
  //     />
  //     {isLoading && <Loader />}
  //     {!isLoading && (
  //       <Form
  //         handleSubmit={handleSave}
  //         submitLabel="Save"
  //         formFooterBackLink="/profile/user-preferences"
  //       >
  //         <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
  //           <Input
  //             id="chunkSize"
  //             type="number"
  //             min={3}
  //             step={1}
  //             max={100}
  //             isRequired
  //             value={defaultChunkSize}
  //           >
  //             Items per page, e.g. transactions
  //           </Input>
  //         </div>
  //       </Form>
  //     )}
  //   </>
  // );
};
