import { Router } from "express";
import {
  addTransaction,
  verifyNewTransferInfo,
  deleteTransaction,
  getAllUserTransactions,
  getTransaction,
  getTransfers,
  verifyTransactionOwnership,
  sendVerifyDelete,
} from "../controllers/transaction-controller";

const router = Router();

router.post("/", verifyNewTransferInfo, addTransaction);

router.put(
  "/:id",
  verifyTransactionOwnership,
  verifyNewTransferInfo,
  deleteTransaction,
  addTransaction
);

router.get("/", getAllUserTransactions);

router.get("/transfers", getTransfers);

router.get("/:id", verifyTransactionOwnership, getTransaction);

router.delete(
  "/:id",
  verifyTransactionOwnership,
  deleteTransaction,
  sendVerifyDelete
);

export default router;
