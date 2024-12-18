type ValidationErrorResponse = {
  error: string;
  message: string[] | string;
  statusCode: 400;
};

export const isValidationErrorResponse = (
  error: unknown,
): error is ValidationErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error &&
    'error' in error &&
    error.statusCode === 400 &&
    (Array.isArray(error.message) || typeof error.message === 'string') &&
    error.message.length > 0 &&
    typeof error.error === 'string'
  );
};
