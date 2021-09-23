import { Router } from "express";
import {
  addTransaction,
  addTransfer,
  deleteTransaction,
  getAllUserTransactions,
  getTransaction,
  getTransfers,
} from "../controllers/transaction-controller";

const router = Router();

router.post("/", addTransfer, addTransaction);

router.get("/", getAllUserTransactions);

router.get("/transfers", getTransfers);

router.get("/:id", getTransaction);

router.delete("/:id", deleteTransaction);

export default router;
