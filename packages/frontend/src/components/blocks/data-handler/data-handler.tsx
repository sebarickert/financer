import { Loader } from '$elements/loader/loader';

interface DataHandlerProps {
  isLoading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export const DataHandler = ({ isLoading, error, data }: DataHandlerProps) => {
  if (isLoading) return <Loader />;

  if (error) throw new Error(`Failed to fetch data: ${error.toString()}`);

  if (!data) throw new Error(`Data not found`);

  return null;
};
