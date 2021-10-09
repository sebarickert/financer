import { Router } from "express";
import {
  addTransaction,
  verifyNewTransferInfo,
  deleteTransaction,
  getAllUserTransactions,
  getTransaction,
  getTransfers,
  verifyTransactionOwnership,
} from "../controllers/transaction-controller";

const router = Router();

router.post("/", verifyNewTransferInfo, addTransaction);

router.put(
  "/",
  verifyTransactionOwnership,
  verifyNewTransferInfo,
  deleteTransaction,
  addTransaction
);

router.get("/", getAllUserTransactions);

router.get("/transfers", getTransfers);

router.get("/:id", verifyTransactionOwnership, getTransaction);

router.delete("/:id", verifyTransactionOwnership, deleteTransaction);

export default router;
