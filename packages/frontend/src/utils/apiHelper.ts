import { SuccessApifulResponseCode } from '@local/types';

const isSuccessfulApiResponseCode = (responseCode: number): boolean =>
  Object.values(SuccessApifulResponseCode).includes(responseCode);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseApiResponse = async (response: Response): Promise<any> => {
  const status = response.status;
  const reponseJson = await response.json();

  return isSuccessfulApiResponseCode(status)
    ? { payload: reponseJson, status }
    : reponseJson;
};

export const parseErrorMessagesToArray = (
  error?: string | string[]
): string[] => {
  if (typeof error === 'undefined') return ['Unknown error.'];

  return typeof error === 'string' ? [error] : error;
};
