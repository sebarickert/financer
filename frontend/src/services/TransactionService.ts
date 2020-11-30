// eslint-disable-next-line import/prefer-default-export
export const addTransaction = async (
  newTransactionData: ITransaction
): Promise<IApiResponse<ITransaction>> => {
  const newTransaction = await fetch("/api/transaction", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTransactionData),
  });

  return newTransaction.json();
};

export const getAllTransferTranscations = async (): Promise<
  IApiResponse<ITransaction[]>
> => {
  const transfers = await fetch("/api/transaction/transfers");
  return transfers.json();
};
