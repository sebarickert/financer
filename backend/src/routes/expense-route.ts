import { Router } from "express";
import {
  verifyNewExpenseInfo,
  listUserExpenses,
} from "../controllers/expense-controller";
import {
  getTransaction,
  deleteTransaction,
  addTransaction,
  verifyTransactionOwnership,
} from "../controllers/transaction-controller";

const router = Router();

router.get("/", listUserExpenses);

router.post("/", verifyNewExpenseInfo, addTransaction);

router.put(
  "/:id",
  verifyTransactionOwnership,
  verifyNewExpenseInfo,
  deleteTransaction,
  addTransaction
);

router.get("/:id", getTransaction);

router.delete("/:id", deleteTransaction);

export default router;
