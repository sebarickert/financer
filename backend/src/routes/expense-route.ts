import { Router } from "express";
import {
  addExpense,
  listUserExpenses,
} from "../controllers/expense-controller";
import {
  getTransaction,
  deleteTransaction,
} from "../controllers/transaction-controller";

import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.get("/", authCheck, listUserExpenses);

router.post("/", authCheck, addExpense);

router.get("/:id", authCheck, getTransaction);

router.delete("/:id", authCheck, deleteTransaction);

export default router;
