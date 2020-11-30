// eslint-disable-next-line import/prefer-default-export
export const addTransaction = async (
  newTransactionData: ITransaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllTransferTranscations = async (): Promise<any> => {
  const transfers = await fetch("/api/transaction/transfers");
  return transfers.json();
};
