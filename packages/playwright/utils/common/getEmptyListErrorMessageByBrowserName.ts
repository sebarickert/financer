export const getEmptyListErrorMessageByBrowserName = (
  browserName: string,
): string => {
  switch (browserName) {
    case 'webkit':
      return 'Select an item in the list';
    default:
      return 'Please select an item in the list.';
  }
};
