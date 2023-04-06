import { Loader } from '$elements/loader/loader';

interface DataHandlerProps {
  isLoading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  skipNotFound?: boolean;
}

export const DataHandler = ({
  isLoading,
  error,
  data,
  skipNotFound,
}: DataHandlerProps) => {
  if (isLoading) return <Loader />;

  if (error) throw new Error(`Failed to fetch data: ${error.toString()}`);

  if (!data && !skipNotFound) throw new Error(`Data not found`);

  return null;
};
