import { Router } from "express";
import {
  verifyNewIncomeInfo,
  listUserIncomes,
} from "../controllers/income-controller";
import {
  addTransaction,
  deleteTransaction,
  getTransaction,
  verifyTransactionOwnership,
} from "../controllers/transaction-controller";

const router = Router();

router.get("/", listUserIncomes);

router.post("/", verifyNewIncomeInfo, addTransaction);

router.put(
  "/:id",
  verifyTransactionOwnership,
  verifyNewIncomeInfo,
  deleteTransaction,
  addTransaction
);

router.get("/:id", verifyTransactionOwnership, getTransaction);

router.delete("/:id", verifyTransactionOwnership, deleteTransaction);

export default router;
