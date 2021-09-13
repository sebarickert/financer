import { Router } from "express";
import {
  addTransactionCategory,
  getAllUserTransactionCategories,
  getTransactionCategory,
  updateTransactionCategory,
} from "../controllers/transaction-category-controller";

const router = Router();

router.get("/", getAllUserTransactionCategories);

router.post("/", addTransactionCategory);

router.get("/:id", getTransactionCategory);

router.put("/:id", updateTransactionCategory);

export default router;
