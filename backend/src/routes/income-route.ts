import { Router } from "express";
import { addIncome, listUserIncomes } from "../controllers/income-controller";
import {
  addTransaction,
  deleteTransaction,
  getTransaction,
} from "../controllers/transaction-controller";

const router = Router();

router.get("/", listUserIncomes);

router.post("/", addIncome, addTransaction);

router.get("/:id", getTransaction);

router.delete("/:id", deleteTransaction);

export default router;
