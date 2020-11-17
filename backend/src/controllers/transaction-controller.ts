import { Response, Request } from "express";

import { IUserModel } from "../models/user-model";
import { findTransactionById } from "../services/transaction-service";

export const getTransaction = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const transactionId = req.params.id;
  const transaction = await findTransactionById(transactionId);

  if (transaction === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ["Transaction not found."],
    });
    return;
  }
  if (`${transaction?.user}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ["Not authorized to view that transaction."],
    });
    return;
  }
  res
    .status(200)
    .json({ authenticated: true, status: 200, payload: transaction });
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const user = req.user as IUserModel;
  const transactionId = req.params.id;
  const transaction = await findTransactionById(transactionId);

  if (transaction === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ["Transaction not found."],
    });
    return;
  }
  if (`${transaction?.user}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ["Not authorized to view that transaction."],
    });
    return;
  }

  await transaction.remove();

  res.status(200).json({ authenticated: true, status: 200 });
};
