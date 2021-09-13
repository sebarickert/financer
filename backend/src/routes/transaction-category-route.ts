import { Router } from "express";
import {
  addTransactionCategory,
  deleteTransactionCategory,
  getAllUserTransactionCategories,
  getTransactionCategory,
  updateTransactionCategory,
} from "../controllers/transaction-category-controller";

const router = Router();

router.get("/", getAllUserTransactionCategories);

router.post("/", addTransactionCategory);

router.get("/:id", getTransactionCategory);

router.delete("/:id", deleteTransactionCategory);

router.put("/:id", updateTransactionCategory);

export default router;
