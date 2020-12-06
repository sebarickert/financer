const isUpdateAllowed = (location: string): boolean => {
  const isEditPage = location.includes("/edit");
  const isAddPage = location.includes("/add");

  return !isEditPage && !isAddPage;
};

export default isUpdateAllowed;
