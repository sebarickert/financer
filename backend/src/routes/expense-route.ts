import { Router } from "express";
import {
  addExpense,
  listUserExpenses,
} from "../controllers/expense-controller";
import {
  getTransaction,
  deleteTransaction,
  addTransaction,
} from "../controllers/transaction-controller";

const router = Router();

router.get("/", listUserExpenses);

router.post("/", addExpense, addTransaction);

router.get("/:id", getTransaction);

router.delete("/:id", deleteTransaction);

export default router;
